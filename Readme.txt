Service Provider Directory Resource
1. Organization
	1.1 Get all data
		URL : host:port/{apikey}/Organization
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/Organization

		response:
		{
			"err_code": 0,
			"data": [
				{
					"resourceType": "Organization",
					"id": "orgjfrz0jbh",
					"identifier": [
						{
							"id": "idejfrz0jbh",
							"use": "usual",
							"type": "BRN",
							"system": "idejfrz0jbh",
							"value": "340303173291749",
							"period": "2018-01-11 to 2019-01-11",
							"assigner": "orgjfrz0jbh"
						}
					],
					"active": "true",
					"type": "prov",
					"name": "hcs organization",
					"alias": "hcs office",
					"telecom": [
						{
							"id": "copjfrz0jbh",
							"system": "phone",
							"value": "085713329749",
							"use": "mobile",
							"rank": "1",
							"period_start": "2018-01-11 00:00:00",
							"period_end": "2019-01-11 00:00:00"
						}
					],
					"address": [
						{
							"id": "addjfrz0jbh",
							"use": "home",
							"type": "both",
							"text": "Jl.Cantel352BaciroGondokusumanYogyakarta",
							"line": "Jl.CantelNo352",
							"city": "Yogyakarta",
							"district": "null",
							"state": "DaerahIstimewaYogyakarta",
							"postal_code": "55542",
							"country": "Indonesia",
							"period_start": "2018-01-11 00:00:00",
							"period_end": "2019-01-11 00:00:00"
						}
					],
					"partOf": "192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/Organization?_id=orgjf7wq2xi",
					"contact": [
						{
							"id": "orcjfrz0jbh",
							"purpose": "BILL",
							"name": {
								"id": "hunjfrz0jbh",
								"use": "usual",
								"text": "Ir. AgungPraharjo M.Kom.",
								"family": "Praharjo",
								"given": "Paijo",
								"prefix": "Ir.",
								"suffix": "M.Kom.",
								"period": "2018-01-11 00:00:00 to 2019-01-11 00:00:00"
							},
							"address": {
								"id": "adcjfrz0jbh",
								"use": "home",
								"type": "both",
								"text": "Jl.AhmadYaniGendengGondokusumanYogyakarta",
								"line": "Jl.AhmadYani",
								"city": "Yogyakarta",
								"district": "null",
								"state": "DaerahIstimewaYogyakarta",
								"postalCode": "55542",
								"country": "Indonesia",
								"period": "2018-01-11 00:00:00 to 2019-01-11 00:00:00"
							},
							"telecom": [
								{
									"id": "ccpjfrz0jbh",
									"system": "phone",
									"value": "085743504579",
									"use": "mobile",
									"rank": "1",
									"period": "2018-01-11 00:00:00 to 2019-01-11 00:00:00"
								}
							]
						}
					],
					"endpoint": []
				}
			]
		}

	1.2 Get data by id
		URL : host:port/{apikey}/Organization?id=value
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/Organization?_id=orgjf7woha6	

		response :
		{
		    "err_code": 0,
		    "data": [
		        {
		            "resourceType": "Organization",
		            "id": "orgjf7woha6",
		            "identifier": [
		                {
		                    "id": "idejf7woha6",
		                    "use": "usual",
		                    "type": "BRN",
		                    "system": "null",
		                    "value": "340303173291737",
		                    "period": "2018-01-11 to 2019-01-11",
		                    "assigner": "orgjf7woha6"
		                }
		            ],
		            "active": "true",
		            "type": "prov",
		            "name": "hcs organization edit",
		            "alias": "hcs office",
		            "telecom": [
		                {
		                    "id": "copjf7woha6",
		                    "system": "phone",
		                    "value": "085713329737",
		                    "use": "mobile",
		                    "rank": "1",
		                    "period_start": "2018-01-11 00:00:00",
		                    "period_end": "2019-01-11 00:00:00"
		                }
		            ],
		            "address": [
		                {
		                    "id": "addjf7woha6",
		                    "use": "home",
		                    "type": "both",
		                    "text": "Jl.Cantel352BaciroGondokusumanYogyakarta",
		                    "line": "Jl.CantelNo352",
		                    "city": "Yogyakarta",
		                    "district": "null",
		                    "state": "DaerahIstimewaYogyakarta",
		                    "postal_code": "55542",
		                    "country": "Indonesia",
		                    "period_start": "2018-01-11 00:00:00",
		                    "period_end": "2019-01-11 00:00:00"
		                }
		            ],
		            "partOf": "null",
		            "contact": [
		                {
		                    "id": "orcjf7woha6",
		                    "purpose": "bill",
		                    "name": {
		                        "id": "hunjf7woha6",
		                        "use": "usual",
		                        "text": "Ir. AgungPraharjo M.Kom.",
		                        "family": "Praharjoyo",
		                        "given": "Paijo",
		                        "prefix": "Ir.",
		                        "suffix": "M.Kom.",
		                        "period": "2018-01-11 00:00:00 to 2019-01-11 00:00:00"
		                    },
		                    "address": {
		                        "id": "adcjf7woha6",
		                        "use": "home",
		                        "type": "both",
		                        "text": "Jl.AhmadYaniGendengGondokusumanYogyakarta",
		                        "line": "Jl.AhmadYani",
		                        "city": "Yogyakarta",
		                        "district": "null",
		                        "state": "DaerahIstimewaYogyakarta",
		                        "postalCode": "55542",
		                        "country": "Indonesia",
		                        "period": "2018-01-11 00:00:00 to 2019-01-11 00:00:00"
		                    },
		                    "telecom": [
		                        {
		                            "id": "ccpjf7woha6",
		                            "system": "phone",
		                            "value": "085743504578",
		                            "use": "mobile",
		                            "rank": "1",
		                            "period": "2018-01-11 00:00:00 to 2019-01-11 00:00:00"
		                        }
		                    ]
		                },
		                {
		                    "id": "orcjfnfq5ih",
		                    "purpose": "BILL",
		                    "name": {
		                        "id": "hunjfnfq5ih",
		                        "use": "usual",
		                        "text": "Ir. AgungPraharjo M.Kom.",
		                        "family": "Praharjo",
		                        "given": "Paijo",
		                        "prefix": "Ir.",
		                        "suffix": "M.Kom.",
		                        "period": "2018-01-11 00:00:00 to 2019-01-11 00:00:00"
		                    },
		                    "address": {
		                        "id": "adcjfnfq5ih",
		                        "use": "home",
		                        "type": "both",
		                        "text": "Jl.AhmadYaniGendengGondokusumanYogyakarta",
		                        "line": "Jl.AhmadYani",
		                        "city": "Yogyakarta",
		                        "district": "null",
		                        "state": "DaerahIstimewaYogyakarta",
		                        "postalCode": "55542",
		                        "country": "Indonesia",
		                        "period": "2018-01-11 00:00:00 to 2019-01-11 00:00:00"
		                    },
		                    "telecom": [
		                        {
		                            "id": "ccpjfnfq5ih",
		                            "system": "phone",
		                            "value": "085743504478",
		                            "use": "mobile",
		                            "rank": "1",
		                            "period": "2018-01-11 00:00:00 to 2019-01-11 00:00:00"
		                        }
		                    ]
		                }
		            ],
		            "endpoint": [
		                {
		                    "id": "192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/endpoint?_id=enpjfjj4s45"
		                },
		                {
		                    "id": "192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/endpoint?_id=enpjfrxsdrn"
		                }
		            ]
		        }
		    ]
		}
		
	1.3 Search Data
		URL : host:port/{apikey}/Organization?_id=organization.id&active=organization.ctive&address=organization.address&city=organization.address_city&country=organization.address_country&postal_code=organization.address_postalcode&state=organization.address_state&address_use=organization.address_use&endpoint=endpoint.id&identifier=indentifier.value&name=organization.name&part_of=organization.id&type=organization.type	
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/Organization?_id=orgjf7woha6
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/Organization?type=prov
		reponse :
		{
		    "err_code": 0,
		    "data": [
			    	{
		            "resourceType": "Organization",
		            "id": "orgjfrz0jbh",
		            "identifier": [
		                {
		                    "id": "idejfrz0jbh",
		                    "use": "usual",
		                    "type": "BRN",
		                    "system": "idejfrz0jbh",
		                    "value": "340303173291749",
		                    "period": "2018-01-11 to 2019-01-11",
		                    "assigner": "orgjfrz0jbh"
		                }
		            ],
		            "active": "true",
		            "type": "prov",
		            "name": "hcs organization",
		            "alias": "hcs office",
		            "telecom": [
		                {
		                    "id": "copjfrz0jbh",
		                    "system": "phone",
		                    "value": "085713329749",
		                    "use": "mobile",
		                    "rank": "1",
		                    "period_start": "2018-01-11 00:00:00",
		                    "period_end": "2019-01-11 00:00:00"
		                }
		            ],
		            "address": [
		                {
		                    "id": "addjfrz0jbh",
		                    "use": "home",
		                    "type": "both",
		                    "text": "Jl.Cantel352BaciroGondokusumanYogyakarta",
		                    "line": "Jl.CantelNo352",
		                    "city": "Yogyakarta",
		                    "district": "null",
		                    "state": "DaerahIstimewaYogyakarta",
		                    "postal_code": "55542",
		                    "country": "Indonesia",
		                    "period_start": "2018-01-11 00:00:00",
		                    "period_end": "2019-01-11 00:00:00"
		                }
		            ],
		            "partOf": "192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/Organization?_id=orgjf7wq2xi",
		            "contact": [
		                {
		                    "id": "orcjfrz0jbh",
		                    "purpose": "BILL",
		                    "name": {
		                        "id": "hunjfrz0jbh",
		                        "use": "usual",
		                        "text": "Ir. AgungPraharjo M.Kom.",
		                        "family": "Praharjo",
		                        "given": "Paijo",
		                        "prefix": "Ir.",
		                        "suffix": "M.Kom.",
		                        "period": "2018-01-11 00:00:00 to 2019-01-11 00:00:00"
		                    },
		                    "address": {
		                        "id": "adcjfrz0jbh",
		                        "use": "home",
		                        "type": "both",
		                        "text": "Jl.AhmadYaniGendengGondokusumanYogyakarta",
		                        "line": "Jl.AhmadYani",
		                        "city": "Yogyakarta",
		                        "district": "null",
		                        "state": "DaerahIstimewaYogyakarta",
		                        "postalCode": "55542",
		                        "country": "Indonesia",
		                        "period": "2018-01-11 00:00:00 to 2019-01-11 00:00:00"
		                    },
		                    "telecom": [
		                        {
		                            "id": "ccpjfrz0jbh",
		                            "system": "phone",
		                            "value": "085743504579",
		                            "use": "mobile",
		                            "rank": "1",
		                            "period": "2018-01-11 00:00:00 to 2019-01-11 00:00:00"
		                        }
		                    ]
		                }
		            ],
		            "endpoint": []
		        }
		    ]
		}	

		NB :
		_id;string
		active;bolean
		address;string
		city;string
		country;string
		postal_code;string/number //
		state;string //space encodeURI masih ada bug untuk sprintf
		address_use;code //Data code dari api `address-use`
		endpoint;string //endpointId
		identifier; number //indentifier.value
		name; string //name of organization
		part_of; string // organizationId
		type;string // organization type


1.4 Add Organization
	URL : host:port/{apikey}/Organization
	example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/Organization
	body :
		{
			"identifier":{
				"use": "usual",
				"type": "BRN",
				"value": "340303173291741",
				"period": "2018-01-11 to 2019-01-11"
			},
			"active" : "true",
			"type" : "prov",
			"name" : "HCS Organization",
			"alias" : "HCS Office",
			"telecom" :{
				"system": "phone",
				"value": "085713329741",
				"use": "mobile",
				"rank":"1",
				"period": "2018-01-11 to 2019-01-11"
			},
			"address" :{
				"use": "home",
				"type": "both",
				"text": "Jl.Cantel352BaciroGondokusumanYogyakarta",
				"line":"Jl.CantelNo352",
				"city":"Yogyakarta",
				"district":"null",
				"state": "DaerahIstimewaYogyakarta",
				"postal_code": "55542",
				"country":"Indonesia",
				"period": "2018-01-11 to 2019-01-11"
			},
			"partOf": "null",
			"contact":{
				"purpose":"bill",
				"name":{
					"use": "usual",
					"text": "AgungPraharjo",
					"family": "Praharjo",
					"given": "Paijo",
					"prefix": "Ir.",
					"suffix": "M.Kom.",
					"period": "2018-01-11 to 2019-01-11"
				},
				"telecom":{
					"system":"phone",
					"value": "085743504578",
					"use": "mobile",
					"rank": "1",
					"period": "2018-01-11 to 2019-01-11"
				},
				"address":{
					"use": "home",
					"type": "both",
					"text": "Jl.AhmadYaniGendengGondokusumanYogyakarta",
					"line": "Jl.AhmadYani",
					"city": "Yogyakarta",
					"district":"null",
					"state": "DaerahIstimewaYogyakarta",
					"postal_code": "55542",
					"country": "Indonesia",
					"period": "2018-01-11 to 2019-01-11"
				}
			},
			"endpoint" : "null"
		}
		
		Response : 
		{
				"err_code": 0,
				"err_msg": "Organization has been add.",
				"data": [
						{
								"_id": "orgjh60djbu"
						}
				]
		}
		
		NB : 
		identifier.use / code / Value diisi dari api `identifier-use` / O
		identifier.type / code / Value diisi dari api `identifier-type` / O
		identifier.value / string / Uniqe value, digunakan sebagai no identitas, misalnya saja NIK, No SIM / O
		identifier.period / string / Masa berlaku dari identitas, format: yyyy-mm-dd to yyyy-mm-dd / O 
		active / boolean / organisasi masih digunakan aktif / O
		type / CodeableConcept / Value diisi dari api `organization-type` / O
		name / string / nama organization / O
		alias / string / Daftar nama alternatif yang dikenal organisasi, atau dikenal sebagai di masa lalu / O
		telecom.system / code / Value diisi dari api `contact-point-system` / O
		telecom.value / string / value harus belum exist dari `contact-point-value` / O
		telecom.use / code / Value diisi dari api `contact-point-use` / O
		telecom.rank / integer / Urutan dari telekomunikasi yang digunakan / O
		telecom.period / integer / Masa berlaku dari telekomunikasi, format: yyyy-mm-dd to yyyy-mm-dd / O
		address.use / code / Value diisi dari api `address-use` / O
		address.type / code / Value diisi dari api `address-type` / O
		address.text / string  / Alamat lengkap / O
		address.line / string / Alamat jalan / O
		address.city / string / Nama kota dari alamat domisili / O
		address.district / string / Alamat untuk distrik  / O
		address.state / string / Nama propinsi dari alamat domisili/ negara bagian untuk negara persekutuan  / O
		address.postal_code / string / kode pos  / O
		address.country / string / nama negara / O
		address.period / string / Masa berlaku untuk alamat tersebut / O
		partOf / string / ID Organization / O
		contact.purpose/ 	CodeableConcept/ Value diisi dari api `contact-entity-type`  / O
		contact.name.use / code / value diisi dari api `name-use`  / O
		contact.name.text / string / nama lengkap  / O
		contact.name.family / string / nama keluarga  / O
		contact.name.given / string / Nama pemberian  / O
		contact.name.prefix / string / Gelar akademik, atau gelar kebangasawanan / O
		contact.name.suffix / string / Gelar akademik, atau gelar keahlian / O
		contact.name.period / string / Masa berlaku dari nama, format:yyyy-mm-dd to yyyy-mm-dd / O
		contact.telecom.system / code / Value diisi dari api `contact-point-system` / O
		contact.telecom.value / string / value harus belum exist dari `contact-point-value` / O
		contact.telecom.use / code / Value diisi dari api `contact-point-use` / O
		contact.telecom.rank / integer / Urutan dari telekomunikasi yang digunakan / O
		contact.telecom.period / integer / Masa berlaku dari telekomunikasi, format: yyyy-mm-dd to yyyy-mm-dd / O
		contact.address.use / code / Value diisi dari api `address-use` / O
		contact.address.type / code / Value diisi dari api `address-type` / O
		contact.address.text / string  / Alamat lengkap / O
		contact.address.line / string / Alamat jalan / O
		contact.address.city / string / Nama kota dari alamat domisili / O
		contact.address.district / string / Alamat untuk distrik  / O
		contact.address.state / string / Nama propinsi dari alamat domisili/ negara bagian untuk negara persekutuan  / O
		contact.address.postal_code / string / kode pos  / O
		contact.address.country / string / nama negara / O
		contact.address.period / string / Masa berlaku untuk alamat tersebut / O
		endpoint / string / ID Organization / O

1.5 Add Organization organizationContact
	url : host:port/{apikey}/Organization/{organization-id}/organizationContact
	example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/Organization/orgjf7woha6/organizationContact
	body :
		{
			"purpose":"BILL",
			"name":{
				"use": "usual",
				"text": "AgungPraharjo",
				"family": "Praharjo",
				"given": "Paijo",
				"prefix": "Ir.",
				"suffix": "M.Kom.",
				"period": "2018-01-11 to 2019-01-11"
			},
			"telecom":{
				"system":"phone",
				"value": "085743504478",
				"use": "mobile",
				"rank": "1",
				"period": "2018-01-11 to 2019-01-11"
			},
			"address":{
				"use": "home",
				"type": "both",
				"text": "Jl.AhmadYaniGendengGondokusumanYogyakarta",
				"line": "Jl.AhmadYani",
				"city": "Yogyakarta",
				"district":"null",
				"state": "DaerahIstimewaYogyakarta",
				"postal_code": "55542",
				"country": "Indonesia",
				"period": "2018-01-11 to 2019-01-11"
			}
		}
		
		Response :
		{
				"err_code": 0,
				"err_msg": "Organization Contact has been add.",
				"data": [
						{
								"_id": "orgjf7woha6"
						}
				]
		}
		
		NB :
		purpose/ 	CodeableConcept/ Value diisi dari api `contact-entity-type`  / O
		name.use / code / value diisi dari api `name-use`  / O
		name.text / string / nama lengkap  / O
		name.family / string / nama keluarga  / O
		name.given / string / Nama pemberian  / O
		name.prefix / string / Gelar akademik, atau gelar kebangasawanan / O
		name.suffix / string / Gelar akademik, atau gelar keahlian / O
		name.period / string / Masa berlaku dari nama, format:yyyy-mm-dd to yyyy-mm-dd / O
		telecom.system / code / Value diisi dari api `contact-point-system` / O
		telecom.value / string / value harus belum exist dari `contact-point-value` / O
		telecom.use / code / Value diisi dari api `contact-point-use` / O
		telecom.rank / integer / Urutan dari telekomunikasi yang digunakan / O
		telecom.period / integer / Masa berlaku dari telekomunikasi, format: yyyy-mm-dd to yyyy-mm-dd / O
		address.use / code / Value diisi dari api `address-use` / O
		address.type / code / Value diisi dari api `address-type` / O
		address.text / string  / Alamat lengkap / O
		address.line / string / Alamat jalan / O
		address.city / string / Nama kota dari alamat domisili / O
		address.district / string / Alamat untuk distrik  / O
		address.state / string / Nama propinsi dari alamat domisili/ negara bagian untuk negara persekutuan  / O
		address.postal_code / string / kode pos  / O
		address.country / string / nama negara / O
		address.period / string / Masa berlaku untuk alamat tersebut / O
		
1.6 Add Organization Identifier
	url : host:port/{apikey}/Organization/{organization-id}/Identifier
	example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/Organization/orgjf7woha6/Identifier
	body : 
	{
		"use": "usual",
		"type": "BRN",
		"value": "3403031732917419",
		"period": "2018-01-11 to 2019-01-11"
	}
	
	response :
	{
			"err_code": 0,
			"err_msg": "Identifier has been add in this organization.",
			"data": [
					{
							"id": "idejh72qwqd",
							"use": "usual",
							"type": "BRN",
							"system": "idejh72qwqd",
							"value": "3403031732917419",
							"period": "2018-01-11 to 2019-01-11"
					}
			]
	}
1.7 Add Organization Telecom
	url : host:port/{apikey}/Organization/{organization-id}/Telecom
	example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/Organization/orgjf7woha6/Telecom
	body : 
	{
		"system": "phone",
		"value": "085713329734",
		"use": "mobile",
		"rank":"1",
		"period": "2018-01-11 to 2019-01-11"
	}
	
	response :
	{
			"err_code": 0,
			"err_msg": "Telecom has been add in this organization.",
			"data": [
					{
							"id": "cpjh734v3c",
							"system": "phone",
							"value": "085713329734",
							"use": "mobile",
							"rank": "1",
							"period": ""
					}
			]
	}
1.8 Add Organization Address
	url : host:port/{apikey}/Organization/{organization-id}/Address
	example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/Organization/orgjf7woha6/Address
	
	body :
	{
		"use": "home",
		"type": "both",
		"text": "Jl.Cantel352BaciroGondokusumanYogyakarta",
		"line":"Jl.CantelNo354",
		"city":"Yogyakarta",
		"district":"null",
		"state": "DaerahIstimewaYogyakarta",
		"postal_code": "55542",
		"country":"Indonesia",
		"period": "2018-01-11 to 2019-01-11"
	}
	
	response :
	{
			"err_code": 0,
			"err_msg": "Address has been add in this organization.",
			"data": [
					{
							"id": "addjh736vnc",
							"use": "home",
							"type": "both",
							"text": "Jl.Cantel352BaciroGondokusumanYogyakarta",
							"line": "Jl.CantelNo354",
							"city": "Yogyakarta",
							"district": "null",
							"state": "DaerahIstimewaYogyakarta",
							"postalCode": "55542",
							"addressCountry": "Indonesia",
							"period": ""
					}
			]
	}
1.9 Add Organization endpoint
	url : host:port/{apikey}/Organization/{organization-id}/Endpoint
	example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/Organization/orgjf7woha6/Endpoint
	body : 
	{
		"endpoint_id" : "enpjfrxsdrn"
	}
	
	response : 
		{
				"err_code": 0,
				"err_msg": "Endpoint has been add in this organization.",
				"data": [
						{
								"endpoint_id": "enpjfrxsdrn",
								"organization_id": "orgjf7woha6"
						}
				]
		}
		
	1.10 	Put Organization
	URL : host:port/{apikey}/Organization/:organization_id
	example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/Organization/orgjf7woha6
	body :
	{
		"name": "organization",
		"active" : "true",
		"type": "prov",
		"alias": "office",
		"partOf": "orgjf7wq2xi",
		"endpoint": "enpjfjj4s45"
	}
	response :
	{
			"err_code": 0,
			"err_msg": "Organization has been update.",
			"data": [
					{
							"_id": "orgjf7woha6"
					}
			]
	}
	

	1.11 Put OrganizationContact
	URL : host:port/{apikey}/Organization/:organization_id/OrganizationContact/:organization_contact_id?
	example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/Organization/orgjf7woha6/organizationContact/orcjfnfq5ih
	body : 
	{
		"purpose": "BILL"
	}
	
	response :
	{
			"err_code": 0,
			"err_msg": "Organization Contact has been update.",
			"data": [
					{
							"_id": "orcjfnfq5ih"
					}
			]
	}
	
	1.11 Put Organization Contact Address
		URL : host:port/{apikey}/Organization/:organization_id/OrganizationContact/:organization_contact_id?/Address/:address_id?
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/Organization/orgjf7woha6/OrganizationContact/orcjf7woha6/Address/adcjf7woha6
		body : 
		{
			"use": "home",
			"type": "both",
			"text": "Jl.AhmadYaniGendengGondokusumanYogyakarta",
			"line":"Jl.AhmadYani",
			"city":"Yogyakarta",
			"district":"DIY",
			"state": "DaerahIstimewaYogyakarta",
			"postal_code": "55542",
			"country":"Indonesia",
			"period": "2018-01-11 to 2019-01-11"
		}
		
		response :
		{
			"err_code": 0,
			"err_msg": "Address has been update in this Organization Contact.",
			"data": [
					{
							"id": "adcjf7woha6",
							"use": "home",
							"type": "both",
							"text": "Jl.AhmadYaniGendengGondokusumanYogyakarta",
							"line": "Jl.AhmadYani",
							"city": "Yogyakarta",
							"district": "DIY",
							"state": "DaerahIstimewaYogyakarta",
							"postalCode": "55542",
							"addressCountry": "Indonesia",
							"period": ""
					}
			]
		}
	1.12 Put Organization Contact Telecom
		URL : host:port/{apikey}/Organization/:organization_id/OrganizationContact/:organization_contact_id?/Telecom/:contact_point_id?
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/Organization/orgjf7woha6/OrganizationContact/orcjf7woha6/Telecom/ccpjf7woha6
		body :
		{
			"system": "phone",
			"value": "085743504577",
			"use": "mobile",
			"rank": "1",
			"period": "2018-01-11 00:00:00 to 2019-01-11 00:00:00"
		}
		
		response :
		{
				"err_code": 0,
				"err_msg": "Telecom has been update in this Organization Contact.",
				"data": [
						{
								"id": "ccpjf7woha6",
								"system": "phone",
								"value": "085743504577",
								"use": "mobile",
								"rank": "1",
								"period": ""
						}
				]
		}
		
	1.13 Put Organization Contact HumanName
		URL : host:port/{apikey}/Organization/:organization_id/OrganizationContact/:organization_contact_id?/HumanName/:human_name_id?
		example : 
		
		body : 
		{
			"use": "usual",
			"text": "Ir. AgungPraharjo M.Kom.",
			"family": "Praharjoyo",
			"given": "M Paijo",
			"prefix": "Ir.",
			"suffix": "M.Kom.",
			"period": "2018-01-11 to 2019-01-11"
		}
		Response :
		{
				"err_code": 0,
				"err_msg": "Human Name has been update in this Organization Contact.",
				"data": [
						{
								"id": "hunjf7woha6",
								"use": "usual",
								"text": "Ir. AgungPraharjo M.Kom.",
								"family": "Praharjoyo",
								"given": "M Paijo",
								"prefix": "M.Kom.",
								"period": "2018-01-11 to 2019-01-11"
						}
				]
		}
	1.14 	Put Organization Identifier
	URL : host:port/{apikey}/Organization/:organization_id/Identifier/:identifier_id
	example :
	body :
	{
		"use": "usual",
		"type": "BRN",
		"value": "3403031732917438",
		"period": "2018-01-11 to 2019-01-11"
	}
	
	response : 
	{
			"err_code": 0,
			"err_msg": "Identifier has been update in this organization.",
			"data": [
					{
							"id": "idejf7woha6",
							"use": "usual",
							"type": "BRN",
							"system": "null",
							"value": "3403031732917438",
							"period": "2018-01-11 to 2019-01-11"
					}
			]
	}
	
	1.15 	Put Organization Address
	URL : host:port/{apikey}/Organization/:organization_id/Address/:address_id
	example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/Organization/orgjf7woha6/Address/addjh736vnc
	body :
	{
		"use": "home",
		"type": "both",
		"text": "Jl.Cantel352BaciroGondokusumanYogyakarta",
		"line":"Jl.CantelNo344",
		"city":"Yogyakarta",
		"district":"null",
		"state": "DaerahIstimewaYogyakarta",
		"postal_code": "55542",
		"country":"Indonesia",
		"period": "2018-01-11 to 2019-01-11"
	}
	
	response :
	{
			"err_code": 0,
			"err_msg": "Address has been update in this Organization.",
			"data": [
					{
							"id": "addjh736vnc",
							"use": "home",
							"type": "both",
							"text": "Jl.Cantel352BaciroGondokusumanYogyakarta",
							"line": "Jl.CantelNo344",
							"city": "Yogyakarta",
							"district": "null",
							"state": "DaerahIstimewaYogyakarta",
							"postalCode": "55542",
							"addressCountry": "Indonesia",
							"period": ""
					}
			]
	}
	1.16 	Put Organization Telecom
	URL : host:port/{apikey}/Organization/:organization_id/Telecom/:contact_point_id
	example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/Organization/orgjf7woha6/Telecom/cpjh734v3c
	body :
	{
		"system": "phone",
		"value": "085713329736",
		"use": "mobile",
		"rank":"1",
		"period": "2018-01-11 to 2019-01-11"
	}
	
	response :
	{
			"err_code": 0,
			"err_msg": "Telecom has been update in this organization.",
			"data": [
					{
							"id": "cpjh734v3c",
							"system": "phone",
							"value": "085713329736",
							"use": "mobile",
							"rank": "1",
							"period": ""
					}
			]
	}
	
	2. Location 
	2.1 Get All Data
		URL : host:port/{apikey}/Location
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/Location
		Response :
		{
				"err_code": 0,
				"data": [
					{
								"resourceType": "Location",
								"id": "locjfs0d8mi",
								"status": "active",
								"operationalStatus": "C",
								"name": "location name",
								"alias": "location alias",
								"description": "description",
								"mode": "instance",
								"type": "DX",
								"telecom": [
										{
												"id": "copjfs0d8mi",
												"system": "phone",
												"value": "085643766484",
												"use": "mobile",
												"rank": "1",
												"period_start": "2018-01-11 00:00:00",
												"period_end": "2019-01-11 00:00:00"
										}
								],
								"address": [
										{
												"id": "addjfs0d8mi",
												"use": "home",
												"type": "both",
												"text": "Jl.Cantel352BaciroGondokusumanYogyakarta",
												"line": "Jl.CantelNo352",
												"city": "Yogyakarta",
												"district": "null",
												"state": "DaerahIstimewaYogyakarta",
												"postal_code": "55542",
												"country": "Indonesia",
												"period_start": "2018-01-11 00:00:00",
												"period_end": "2019-01-11 00:00:00"
										}
								],
								"physicalType": "si",
								"position": [
										{
												"id": "lopjfs0d8mi",
												"longitude": "110.377",
												"latitude": "-7.783",
												"altitude": "24"
										}
								],
								"managingOrganization": "192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/Organization?_id=orgjf7woha6",
								"partOf": "null",
								"endpoint": []
						}
				]
		}
	2.2 Get data by id
		URL : host:port/{apikey}/Location?_id=value
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/Location?_id=locjf9j2efw
		Response :
		{
				"err_code": 0,
				"data": [
						{
								"resourceType": "Location",
								"id": "locjf9j2efw",
								"status": "active",
								"operationalStatus": "c",
								"name": "location name",
								"alias": "location alias",
								"description": "description",
								"mode": "instance",
								"type": "dx",
								"telecom": [
										{
												"id": "copjf9j2efw",
												"system": "phone",
												"value": "085643766434",
												"use": "mobile",
												"rank": "1",
												"period_start": "2018-01-11 00:00:00",
												"period_end": "2019-01-11 00:00:00"
										}
								],
								"address": [
										{
												"id": "addjf9j2efw",
												"use": "home",
												"type": "both",
												"text": "Jl.Cantel352BaciroGondokusumanYogyakarta",
												"line": "Jl.CantelNo352",
												"city": "Yogyakarta",
												"district": "null",
												"state": "DaerahIstimewaYogyakarta",
												"postal_code": "55542",
												"country": "Indonesia",
												"period_start": "2018-01-11 00:00:00",
												"period_end": "2019-01-11 00:00:00"
										}
								],
								"physicalType": "si",
								"position": [
										{
												"id": "lopjf9j2efw",
												"longitude": "110.377",
												"latitude": "-7.783",
												"altitude": "24"
										}
								],
								"managingOrganization": "192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/Organization?_id=orgjf7woha6",
								"partOf": "null",
								"endpoint": [
										{
												"id": "192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/endpoint?_id=enpjfrxsdrn"
										}
								]
						}
				]
		}
	2.3	Search Data
		URL : host:port/{apikey}/Location?_id=location.id&name=location.name&alias=location.alias&operational_status=location.operationalStatus&part_of=location.id&status=location.status&type=location.type&near=location.position&
			address=location.address&city=location.address_city&country=location.address_country&postal_code=location.address_code&state=location.address_state&address_use=location.address_use&organization=organization_id&endpoint=endpoint_id&identifier=location.location_id
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/Location?city=Yogyakarta&endpoint=enpjfrxsdrn
		Response :
		{
				"err_code": 0,
				"data": [
						{
								"resourceType": "Location",
								"id": "locjf9j2efw",
								"status": "active",
								"operationalStatus": "c",
								"name": "location name",
								"alias": "location alias",
								"description": "description",
								"mode": "instance",
								"type": "dx",
								"telecom": [
										{
												"id": "copjf9j2efw",
												"system": "phone",
												"value": "085643766434",
												"use": "mobile",
												"rank": "1",
												"period_start": "2018-01-11 00:00:00",
												"period_end": "2019-01-11 00:00:00"
										}
								],
								"address": [
										{
												"id": "addjf9j2efw",
												"use": "home",
												"type": "both",
												"text": "Jl.Cantel352BaciroGondokusumanYogyakarta",
												"line": "Jl.CantelNo352",
												"city": "Yogyakarta",
												"district": "null",
												"state": "DaerahIstimewaYogyakarta",
												"postal_code": "55542",
												"country": "Indonesia",
												"period_start": "2018-01-11 00:00:00",
												"period_end": "2019-01-11 00:00:00"
										}
								],
								"physicalType": "si",
								"position": [
										{
												"id": "lopjf9j2efw",
												"longitude": "110.377",
												"latitude": "-7.783",
												"altitude": "24"
										}
								],
								"managingOrganization": "192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/Organization?_id=orgjf7woha6",
								"partOf": "null",
								"endpoint": [
										{
												"id": "192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/endpoint?_id=enpjfrxsdrn"
										}
								]
						}
				]
		}
		
	2.4 Add Location
		URL : host:port/{apikey}/Location
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/Location
		body :
			{
				"status":"active",
				"operationalStatus":"C",
				"name":"location name",
				"alias":"location alias",
				"description":"description",
				"mode":"kind",
				"type":"DX",
				"telecom":{
					"system":"phone",
					"value":"085643766478",
					"use":"mobile",
					"rank":"1",
					"period":"2018-01-11 to 2019-01-11"
				},
				"address":{
					"use":"home",
					"type":"both",
					"text":"Jl.Cantel352BaciroGondokusumanYogyakarta",
					"line":"Jl.CantelNo352",
					"city":"Yogyakarta",
					"district":"null",
					"state":"DaerahIstimewaYogyakarta",
					"postal_code":"55542",
					"country":"Indonesia",
					"period":"2018-01-11 to 2019-01-11"
				},
				"physicalType":"si",
				"position":{
					"longitude": "110.376798",
					"latitude": "-7.783214",
					"altitude": "24"
				},
				"managingOrganization":"orgjf7woha6",
				"partOf":"",
				"endpoint" : "enpjfrxsdrn"
			}
			
		Response :
			{
					"err_code": 0,
					"err_msg": "Location has been add.",
					"data": [
							{
									"_id": "locjhbea4f2"
							}
					]
			}
	2.5 Add Location Telecom
		URL : host:port/{apikey}/Location/:location_id?/Telecom
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/Location/locjhbea4f2/Telecom
		body : 
		{
			"system": "phone",
			"value": "085713329726",
			"use": "mobile",
			"rank":"1",
			"period": "2018-01-11 to 2019-01-11"
		}
		Response :
		{
				"err_code": 0,
				"err_msg": "Telecom has been add in this location.",
				"data": [
						{
								"id": "cpjhbeif7k",
								"system": "phone",
								"value": "085713329726",
								"use": "mobile",
								"rank": "1",
								"period": ""
						}
				]
		}
	2.6 Add Location Endpoint
		URL : host:port/{apikey}/Location/:location_id?/Endpoint
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/location/locjhbea4f2/Endpoint
		body : 
		{
			"endpoint_id" : "enpjfrxsdrn"
		}
		Response :
		{
				"err_code": 0,
				"err_msg": "Endpoint has been add in this location.",
				"data": [
						{
								"endpoint_id": "enpjfrxsdrn",
								"location_id": "locjhbea4f2"
						}
				]
		}
		
	2.7 Put Location
		URL : host:port/{apikey}/Location/:location_id
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/
		body :
		{
			"status": "active",
			"operationalStatus": "C",
			"name": "nameLocation",
			"alias" : "NL",
			"description":"desc Location",
			"mode":"kind",
			"type":"DX",
			"physicalType" : "si",
			"managingOrganization" : "orgjf7woha6",
			"partOf":"locjf9j2efw",
			"address":"addjhbea4f2",
			"endpoint":"enpjfrxsdrn"
		}
		Response :
		{
				"err_code": 0,
				"err_msg": "Location has been update.",
				"data": [
						{
								"_id": "locjhbea4f2"
						}
				]
		}
		
		NB :
		status
		operationalStatus
		name
		alias
		description
		mode
		type
		physicalType
		managingOrganization
		partOf
		address
		endpoint
	2.8 Put Location Position
		URL : host:port/{apikey}/Location/:location_id/LocationPosition/:location_position_id?
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/Location/locjhbea4f2/LocationPosition/lopjhbea4f2
		body :
		{
			"longitude": "110.37",
			"latitude": "-7.783",
			"altitude": "24"
		}
		Response :
		{
				"err_code": 0,
				"err_msg": "Location Position has been update.",
				"data": [
						{
								"_id": "locjhbea4f2"
						}
				]
		}
	2.9 Put Location Telecom
		URL : host:port/{apikey}/Location/:location_id/Telecom/:contact_point_id?
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/
		body :
		Response :
	2.10 Put Location Address
		URL : host:port/{apikey}/Location/:location_id/Address/:address_id?
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/Location/locjhbea4f2/Address/addjhbea4f2
		body : 
		{
			"use": "home",
			"type": "both",
			"text": "Jl.Cantel352BaciroGondokusumanYogyakarta",
			"line":"Jl.CantelNo344",
			"city":"Yogyakarta",
			"district":"DIY",
			"state": "DaerahIstimewaYogyakarta",
			"postal_code": "55542",
			"country":"Indonesia",
			"period": "2018-01-11 to 2019-01-11"
		}
		Response :
		{
				"err_code": 0,
				"err_msg": "Address has been update in this location.",
				"data": [
						{
								"id": "addjhbea4f2",
								"use": "home",
								"type": "both",
								"text": "Jl.Cantel352BaciroGondokusumanYogyakarta",
								"line": "Jl.CantelNo344",
								"city": "Yogyakarta",
								"district": "DIY",
								"state": "DaerahIstimewaYogyakarta",
								"postalCode": "55542",
								"addressCountry": "Indonesia",
								"period": ""
						}
				]
		}
	3. Practitioner
	3.1 Get All Data
		URL : host:port/{apikey}/Practitioner
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/
		Response : 
		{
				"err_code": 0,
				"data": [
						{
								"resourceType": "Practitioner",
								"id": "prajf9h8zti",
								"identifier": [
										{
												"id": "idejf9h8zti",
												"use": "usual",
												"type": "BRN",
												"system": "null",
												"value": "340303173291217",
												"period": "2018-01-11 to 2019-01-11",
												"assigner": "null"
										}
								],
								"active": "false",
								"name": [
										{
												"id": "hunjf9h8zti",
												"use": "usual",
												"text": "Mr. hardika M.Kom.",
												"family": "catur sapta",
												"given": "dika",
												"prefix": "Mr.",
												"suffix": "M.Kom.",
												"period_start": "2018-01-11 00:00:00",
												"period_end": "2019-01-11 00:00:00"
										}
								],
								"telecom": [
										{
												"id": "copjf9h8zti",
												"system": "phone",
												"value": "085616926474",
												"use": "mobile",
												"rank": "1",
												"period_start": "2018-01-11 00:00:00",
												"period_end": "2019-01-11 00:00:00"
										}
								],
								"address": [
										{
												"id": "addjf9h8zti",
												"use": "home",
												"type": "both",
												"text": "Jl.Cantel352BaciroGondokusumanYogyakarta",
												"line": "Jl.CantelNo352",
												"city": "Yogyakarta",
												"district": "null",
												"state": "DaerahIstimewaYogyakarta",
												"postal_code": "55542",
												"country": "Indonesia",
												"period_start": "2018-01-11 00:00:00",
												"period_end": "2019-01-11 00:00:00"
										}
								],
								"gender": "female",
								"birthdate": "1992-08-17 00:00:00",
								"photo": [
										{
												"id": "attjf9h8zti",
												"type": "image/png",
												"language": "en",
												"url": "attjf9h8zti",
												"size": "446996",
												"hash": "5488a8e1ba237d77d715a21b41b8966591aa85f5",
												"title": "vlcsnap-2017-06-16-20h06m22s006.png",
												"data": "+miUBUWmsj/D1AV/aZuvTE6AAAAAElFTkSuQmCC",
												"creation": "2018-03-27 16:47:01"
										}
								],
								"qualification": [
										{
												"id": "quajf9h8zti",
												"identifier": [
														{
																"id": "idejf9h8zti",
																"use": "usual",
																"type": "BRN",
																"value": "340303173291217",
																"period": "2018-01-11 to 2019-01-11"
														}
												],
												"code": "AA",
												"period": "2018-01-11 00:00:00 to 2019-01-11 00:00:00",
												"issuer": "192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/Organization?_id=orgjf9h8zti"
										}
								],
								"communication": [
										{
												"id": "prcjf9h8zti",
												"language": "en",
												"preferred": "true"
										},
										{
												"id": "prcjftm8fdr",
												"language": "en",
												"preferred": "true"
										}
								]
						}
				]
		}
	3.2 Get data by id
		URL : host:port/{apikey}/Practitioner?_id=value
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/Practitioner?_id=prajf9h8zti
		Response :
		{
				"err_code": 0,
				"data": [
						{
								"resourceType": "Practitioner",
								"id": "prajf9h8zti",
								"identifier": [
										{
												"id": "idejf9h8zti",
												"use": "usual",
												"type": "BRN",
												"system": "null",
												"value": "340303173291217",
												"period": "2018-01-11 to 2019-01-11",
												"assigner": "null"
										}
								],
								"active": "false",
								"name": [
										{
												"id": "hunjf9h8zti",
												"use": "usual",
												"text": "Mr. hardika M.Kom.",
												"family": "catur sapta",
												"given": "dika",
												"prefix": "Mr.",
												"suffix": "M.Kom.",
												"period_start": "2018-01-11 00:00:00",
												"period_end": "2019-01-11 00:00:00"
										}
								],
								"telecom": [
										{
												"id": "copjf9h8zti",
												"system": "phone",
												"value": "085616926474",
												"use": "mobile",
												"rank": "1",
												"period_start": "2018-01-11 00:00:00",
												"period_end": "2019-01-11 00:00:00"
										}
								],
								"address": [
										{
												"id": "addjf9h8zti",
												"use": "home",
												"type": "both",
												"text": "Jl.Cantel352BaciroGondokusumanYogyakarta",
												"line": "Jl.CantelNo352",
												"city": "Yogyakarta",
												"district": "null",
												"state": "DaerahIstimewaYogyakarta",
												"postal_code": "55542",
												"country": "Indonesia",
												"period_start": "2018-01-11 00:00:00",
												"period_end": "2019-01-11 00:00:00"
										}
								],
								"gender": "female",
								"birthdate": "1992-08-17 00:00:00",
								"photo": [
										{
												"id": "attjf9h8zti",
												"type": "image/png",
												"language": "en",
												"url": "attjf9h8zti",
												"size": "446996",
												"hash": "5488a8e1ba237d77d715a21b41b8966591aa85f5",
												"title": "vlcsnap-2017-06-16-20h06m22s006.png",
												"data": "+miUBUWmsj/D1AV/aZuvTE6AAAAAElFTkSuQmCC",
												"creation": "2018-03-27 16:47:01"
										}
								],
								"qualification": [
										{
												"id": "quajf9h8zti",
												"identifier": [
														{
																"id": "idejf9h8zti",
																"use": "usual",
																"type": "BRN",
																"value": "340303173291217",
																"period": "2018-01-11 to 2019-01-11"
														}
												],
												"code": "AA",
												"period": "2018-01-11 00:00:00 to 2019-01-11 00:00:00",
												"issuer": "192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/Organization?_id=orgjf9h8zti"
										}
								],
								"communication": [
										{
												"id": "prcjf9h8zti",
												"language": "en",
												"preferred": "true"
										},
										{
												"id": "prcjftm8fdr",
												"language": "en",
												"preferred": "true"
										}
								]
						}
				]
		}
	3.3	Search Data
		URL : host:port/{apikey}/Practitioner?_id=practitioner.id&active=practitioner.active(true/false)&address=practitioner.address&city=practitioner.address_city&country=practitioner.address_country&postal_code=practitioner.address_postalcode&state=practitioner.address_state&address_use=practitioner.address_use&communication=practitioner.communication&family=human_name.family&gender=practitioner.gender&given=human_name.given&identifier=identifier.value&name=human_name all field&telecom=value	any	kind	of	contact
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/Practitioner?family=catur
		Response :
		{
				"err_code": 0,
				"data": [
						{
								"resourceType": "Practitioner",
								"id": "prajf9h8zti",
								"identifier": [
										{
												"id": "idejf9h8zti",
												"use": "usual",
												"type": "BRN",
												"system": "null",
												"value": "340303173291217",
												"period": "2018-01-11 to 2019-01-11",
												"assigner": "null"
										}
								],
								"active": "false",
								"name": [
										{
												"id": "hunjf9h8zti",
												"use": "usual",
												"text": "Mr. hardika M.Kom.",
												"family": "catur sapta",
												"given": "dika",
												"prefix": "Mr.",
												"suffix": "M.Kom.",
												"period_start": "2018-01-11 00:00:00",
												"period_end": "2019-01-11 00:00:00"
										}
								],
								"telecom": [
										{
												"id": "copjf9h8zti",
												"system": "phone",
												"value": "085616926474",
												"use": "mobile",
												"rank": "1",
												"period_start": "2018-01-11 00:00:00",
												"period_end": "2019-01-11 00:00:00"
										}
								],
								"address": [
										{
												"id": "addjf9h8zti",
												"use": "home",
												"type": "both",
												"text": "Jl.Cantel352BaciroGondokusumanYogyakarta",
												"line": "Jl.CantelNo352",
												"city": "Yogyakarta",
												"district": "null",
												"state": "DaerahIstimewaYogyakarta",
												"postal_code": "55542",
												"country": "Indonesia",
												"period_start": "2018-01-11 00:00:00",
												"period_end": "2019-01-11 00:00:00"
										}
								],
								"gender": "female",
								"birthdate": "1992-08-17 00:00:00",
								"photo": [
										{
												"id": "attjf9h8zti",
												"type": "image/png",
												"language": "en",
												"url": "attjf9h8zti",
												"size": "446996",
												"hash": "5488a8e1ba237d77d715a21b41b8966591aa85f5",
												"title": "vlcsnap-2017-06-16-20h06m22s006.png",
												"data": "+miUBUWmsj/D1AV/aZuvTE6AAAAAElFTkSuQmCC",
												"creation": "2018-03-27 16:47:01"
										}
								],
								"qualification": [
										{
												"id": "quajf9h8zti",
												"identifier": [
														{
																"id": "idejf9h8zti",
																"use": "usual",
																"type": "BRN",
																"value": "340303173291217",
																"period": "2018-01-11 to 2019-01-11"
														}
												],
												"code": "AA",
												"period": "2018-01-11 00:00:00 to 2019-01-11 00:00:00",
												"issuer": "192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/Organization?_id=orgjf9h8zti"
										}
								],
								"communication": [
										{
												"id": "prcjf9h8zti",
												"language": "en",
												"preferred": "true"
										},
										{
												"id": "prcjftm8fdr",
												"language": "en",
												"preferred": "true"
										}
								]
						}
				]
		}
		
		
		NB :
		active;
		address;
		city;
		country;
		postal_code;
		state;
		address_use;
		communication;
		family;
		gender;
		given;
		identifier;
		name;
		telecom;
		
	3.4 Add Practitioner 
		URL : host:port/{apikey}/Practitioner
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/Practitioner
		body : 
		{
			"identifier":{
				"use": "usual",
				"type": "BRN",
				"value": "340303173291276",
				"period": "2018-01-11 to 2019-01-11"
			},
			"active":"true",
			"name":{
				"use":"usual",
				"text":"hardika",
				"family":"catur sapta",
				"given":"dika",
				"prefix":"Mr.",
				"suffix":"M.Kom.",
				"period":"2018-01-11 to 2019-01-11"
			},
			"telecom":{
				"system":"phone",
				"value":"085616926476",
				"use":  "mobile",
				"rank":  "1",
				"period":"2018-01-11 to 2019-01-11"
			},
			"address":{
				"use":"home",
				"type":"both",
				"text": "Jl.Cantel352BaciroGondokusumanYogyakarta",
				"line":"Jl.CantelNo352",
				"city":"Yogyakarta",
				"district":"null",
				"state": "DaerahIstimewaYogyakarta",
				"postal_code": "55542",
				"country":"Indonesia",
				"period": "2018-01-11 to 2019-01-11"
			},
			"gender":"male",
			"birthDate":"1992-08-17",
			"photo":{
				"content_type" : "image/png",
				"language":"en",
				"size":  "446996",
				"title":"vlcsnap-2017-06-16-20h06m22s006.png",
				"data":  "+miUBUWmsj/D1AV/aZuvTE6AAAAAElFTkSuQmCC"
			},
			"qualification"  :{
				"identifier":{
					"use": "usual",
					"type": "BRN",
					"value": "340303173291279",
					"period": "2018-01-11 to 2019-01-11"  
				},
				"code"  : "AA",
				"period":"2018-01-11 to 2019-01-11",
				"issuer":"orgjf7woha6"
			},
			"communication"  :{
				"language" : "en",
				"preferred" : "true"
			}
		}
		Response :
		{
				"err_code": 0,
				"err_msg": "Practitioner has been add.",
				"data": [
						{
								"_id": "prajhbqpca1"
						}
				]
		}
	3.5 Add Practitioner Qualification
		URL : host:port/{apikey}/Practitioner/:practitioner_id?/Qualification
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/Practitioner/prajf9h8zti/Qualification
		body :
		{
			"identifier":{
				"use": "usual",
				"type": "BRN",
				"value": "340303173291246",
				"period": "2018-01-11 to 2019-01-11"  
			},
			"code"  : "AA",
			"period":"2018-01-11 to 2019-01-11",
			"issuer":""
		}
		Response :
		{
				"err_code": 0,
				"err_msg": "Qualification of Practitioner has been add.",
				"data": [
						{
								"_id": "quajhbqlxo5"
						}
				]
		}
	3.6 Add Practitioner Communication
		URL : host:port/{apikey}/Practitioner/:practitioner_id?/Communication
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/Practitioner/prajf9h8zti/Communication
		body : 
		{
			"language" : "en",
			"preferred" : "true"
		}
		Response :
		{
				"err_code": 0,
				"err_msg": "ComPractitioner has been add.",
				"data": [
						{
								"practitioner_communication_id": "prcjhbqh57l",
								"practitioner_communication_language": "en",
								"practitioner_communication_preferred": "true",
								"practitioner_id": "prajf9h8zti"
						}
				]
		}
	3.7 Add Practitioner Identifier
		URL : host:port/{apikey}/Practitioner/:practitioner_id?/Identifier
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/Practitioner/prajf9h8zti/Identifier
		body :
		{
			"use": "usual",
			"type": "BRN",
			"value": "3403031732917449",
			"period": "2018-01-11 to 2019-01-11"
		}
		Response :
		{
				"err_code": 0,
				"err_msg": "Identifier has been add in this practitioner.",
				"data": [
						{
								"id": "idejhbqrsfb",
								"use": "usual",
								"type": "BRN",
								"system": "idejhbqrsfb",
								"value": "3403031732917449",
								"period": "2018-01-11 to 2019-01-11"
						}
				]
		}
	3.8 Add Practitioner HumanName
		URL : host:port/{apikey}/Practitioner/:practitioner_id?/HumanName
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/Practitioner/prajf9h8zti/HumanName
		body :
		{
				"use": "usual",
				"text": "Ir. AgungPraharjo M.Kom.",
				"family": "Praharjoyo",
				"given": "M Paijo",
				"prefix": "Ir.",
				"suffix": "M.Kom.",
				"period": "2018-01-11 to 2019-01-11"
		}
		Response :
		{
				"err_code": 0,
				"err_msg": "Human Name has been add in this practitioner.",
				"data": [
						{
								"id": "hnjhbqykm1",
								"use": "usual",
								"text": "Ir. Ir. AgungPraharjo M.Kom. M.Kom.",
								"family": "Praharjoyo",
								"given": "M Paijo",
								"prefix": "M.Kom.",
								"period": ""
						}
				]
		}
	3.9 Add Practitioner Telecom
		URL : host:port/{apikey}/Practitioner/:practitioner_id?/Telecom
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/Practitioner/prajf9h8zti/Telecom
		body :
		{
			"system": "phone",
			"value": "085713324386",
			"use": "mobile",
			"rank":"1",
			"period": "2018-01-11 to 2019-01-11"
		}
		Response :
		{
				"err_code": 0,
				"err_msg": "Telecom has been add in this practitioner.",
				"data": [
						{
								"id": "cpjhbr20wc",
								"system": "phone",
								"value": "085713324386",
								"use": "mobile",
								"rank": "1",
								"period": ""
						}
				]
		}
	3.10 Add Practitioner Address
		URL : host:port/{apikey}/Practitioner/:practitioner_id?/Address
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/Practitioner/prajf9h8zti/Address
		body :
		{
			"use": "home",
			"type": "both",
			"text": "Jl.Cantel352BaciroGondokusumanYogyakarta",
			"line":"Jl.CantelNo354",
			"city":"Yogyakarta",
			"district":"null",
			"state": "DaerahIstimewaYogyakarta",
			"postal_code": "55542",
			"country":"Indonesia",
			"period": "2018-01-11 to 2019-01-11"
		}
		Response :
		{
				"err_code": 0,
				"err_msg": "Address has been add in this practitioner.",
				"data": [
						{
								"id": "addjhbr5dzx",
								"use": "home",
								"type": "both",
								"text": "Jl.Cantel352BaciroGondokusumanYogyakarta",
								"line": "Jl.CantelNo354",
								"city": "Yogyakarta",
								"district": "null",
								"state": "DaerahIstimewaYogyakarta",
								"postalCode": "55542",
								"addressCountry": "Indonesia",
								"period": ""
						}
				]
		}
	3.11 Add Practitioner Photo
		URL : host:port/{apikey}/Practitioner/:practitioner_id?/Photo
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/Practitioner/prajf9h8zti/Photo
		body :
		{
			"content_type" : "image/png",
			"language":"en",
			"size":  "446996",
			"title":"vlcsnap-2017-06-16-20h06m22s006.png",
			"data":  "+miUBUWmsj/D1AV/aZuvTE6AAAAAElFTkSuQmCC"
		}
		Response :
		{
				"err_code": 0,
				"err_msg": "Photo has been add in this practitioner.",
				"data": [
						{
								"id": "attjhbs2d96",
								"url": "192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/Practitioner/prajf9h8zti/Photo/attjhbs2d96",
								"contentType": "image/png",
								"language": "en",
								"data": "+miUBUWmsj/D1AV/aZuvTE6AAAAAElFTkSuQmCC",
								"size": "446996",
								"hash": "5488a8e1ba237d77d715a21b41b8966591aa85f5",
								"title": "vlcsnap-2017-06-16-20h06m22s006.png",
								"creation": "2018-05-18 16:44:45"
						}
				]
		}
	3.12 Put Practitioner 
		URL : host:port/{apikey}/Practitioner/:practitioner_id?
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/Practitioner/prajf9h8zti
		body :
		{
			"active":"false",
			"gender":"female",
			"birthDate":"1992-08-17 00:00:00"
		}
		Response :
		{
				"err_code": 0,
				"err_msg": "Practitioner has been update.",
				"data": [
						{
								"_id": "prajf9h8zti"
						}
				]
		}
	3.13 Put Practitioner Qualification
		URL : host:port/{apikey}/Practitioner/:practitioner_id?/Qualification/:qualification_id?
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/Practitioner/prajf9h8zti/Qualification/quajf9h8zti
		body :
		{
			"code"  : "AA",
			"period":"2018-01-11 to 2019-01-11",
			"issuer":"orgjfrz0jbh"
		}
		Response :
		{
				"err_code": 0,
				"err_msg": "Qualification has been update.",
				"data": [
						{
								"qualification_id": "quajf9h8zti",
								"qualification_code": "AA",
								"qualification_period_start": "2018-01-11 00:00:00",
								"qualification_period_end": "2019-01-11 00:00:00",
								"practitioner_id": "prajf9h8zti"
						}
				]
		}
	
	3.14 Put Practitioner Qualification Identifier
		URL : host:port/{apikey}/Practitioner/:practitioner_id?/Qualification/:qualification_id?/Identifier/:identifier_id?
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/Practitioner/prajf9h8zti/Qualification/quajf9h8zti/Identifier/idejhbqrsfb
		body :
		{
			"use": "usual",
			"type": "BRN",
			"value": "3403031732917467",
			"period": "2018-01-11 to 2019-01-11"
		}
		Response :
		{
				"err_code": 0,
				"err_msg": "Identifier has been update in this practitioner qualification.",
				"data": [
						{
								"id": "idejf9h8zti",
								"use": "usual",
								"type": "BRN",
								"system": "null",
								"value": "3403031732917467",
								"period": "2018-01-11 to 2019-01-11"
						}
				]
		}
		
	3.15 Put Practitioner Communication
		URL : host:port/{apikey}/Practitioner/:practitioner_id?/Communication/:communication_id?
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/Practitioner/prajf9h8zti/Communication/prcjhbqh57l
		body :
		{
			"language" : "en",
			"preferred" : "true"
		}
		Response :
		{
				"err_code": 0,
				"err_msg": "communication has been update.",
				"data": [
						{
								"practitioner_communication_id": "prcjhbqh57l",
								"practitioner_communication_language": "en",
								"practitioner_communication_preferred": "true",
								"practitioner_id": "prajf9h8zti"
						}
				]
		}
	3.16 Put Practitioner Identifier
		URL : host:port/{apikey}/Practitioner/:practitioner_id?/Identifier/:identifier_id?
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/Practitioner/prajf9h8zti/Identifier/idejhbqrsfb
		body :
		{
			"use": "usual",
			"type": "BRN",
			"value": "3403031732917448",
			"period": "2018-01-11 to 2019-01-11"
		}
		Response :
		{
				"err_code": 0,
				"err_msg": "Identifier has been update in this practitioner.",
				"data": [
						{
								"id": "idejhbqrsfb",
								"use": "usual",
								"type": "BRN",
								"system": "idejhbqrsfb",
								"value": "3403031732917448",
								"period": "2018-01-11 to 2019-01-11"
						}
				]
		}
	3.17 Put Practitioner HumanName
		URL : host:port/{apikey}/Practitioner/:practitioner_id?/HumanName/:human_name_id?
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/Practitioner/prajf9h8zti/HumanName/hnjhbqykm1
		body :
		{
				"use": "usual",
				"text": "Ir. AgungPraharjo M.Kom.",
				"family": "Praharjoyo",
				"given": "Muh Paijo",
				"prefix": "Ir.",
				"suffix": "M.Kom.",
				"period": "2018-01-11 to 2019-01-11"
		}
		Response :
		{
				"err_code": 0,
				"err_msg": "Human Name has been update in this practitioner.",
				"data": [
						{
								"id": "hnjhbqykm1",
								"use": "usual",
								"text": "Ir. AgungPraharjo M.Kom.",
								"family": "Praharjoyo",
								"given": "Muh Paijo",
								"prefix": "M.Kom.",
								"period": "2018-01-11 to 2019-01-11"
						}
				]
		}
	3.18 Put Practitioner Telecom
		URL : host:port/{apikey}/Practitioner/:practitioner_id?/Telecom/:contact_point_id?
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/Practitioner/prajf9h8zti/Telecom/cpjhbr20wc
		body :
		{
			"system": "phone",
			"value": "085713324366",
			"use": "mobile",
			"rank":"1",
			"period": "2018-01-11 to 2019-01-11"
		}
		Response :
		{
				"err_code": 0,
				"err_msg": "Telecom has been update in this practitioner.",
				"data": [
						{
								"id": "cpjhbr20wc",
								"system": "phone",
								"value": "085713324366",
								"use": "mobile",
								"rank": "1",
								"period": ""
						}
				]
		}
	3.19 Put Practitioner Address
		URL : host:port/{apikey}/Practitioner/:practitioner_id?/Address/:address_id?
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/Practitioner/prajf9h8zti/Address/addjhbr5dzx
		body :
		{
			"use": "home",
			"type": "both",
			"text": "Jl.Cantel352BaciroGondokusumanYogyakarta",
			"line":"Jl.CantelNo354",
			"city":"Yogyakarta",
			"district":"DIY",
			"state": "DaerahIstimewaYogyakarta",
			"postal_code": "55542",
			"country":"Indonesia",
			"period": "2018-01-11 to 2019-01-11"
		}
		Response :
		{
				"err_code": 0,
				"err_msg": "Address has been update in this practitioner.",
				"data": [
						{
								"id": "addjhbr5dzx",
								"use": "home",
								"type": "both",
								"text": "Jl.Cantel352BaciroGondokusumanYogyakarta",
								"line": "Jl.CantelNo354",
								"city": "Yogyakarta",
								"district": "DIY",
								"state": "DaerahIstimewaYogyakarta",
								"postalCode": "55542",
								"addressCountry": "Indonesia",
								"period": ""
						}
				]
		}
	3.20 Put Practitioner Photo
		URL : host:port/{apikey}/Practitioner/:practitioner_id?/Photo/:attachment_id?
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/Practitioner/prajf9h8zti/Photo/attjhbs2d96
		body : 
		{
			"content_type" : "image/png",
			"language":"en",
			"size":  "446996",
			"title":"vlcsnap-2017-06-16-20h06m22s006.png",
			"data":  "+miUBUWmsj/D1AV/aZuvTE6AAAAAElFTkSuQmCC"
		}
		Response :
		{
				"err_code": 0,
				"err_msg": "Photo has been update in this practitioner.",
				"data": [
						{
								"id": "attjhbs2d96",
								"url": "192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/Practitioner/prajf9h8zti/Photo/attjhbs2d96",
								"contentType": "image/png",
								"language": "en",
								"data": "+miUBUWmsj/D1AV/aZuvTE6AAAAAElFTkSuQmCC",
								"size": "446996",
								"hash": "5488a8e1ba237d77d715a21b41b8966591aa85f5",
								"title": "vlcsnap-2017-06-16-20h06m22s006.png",
								"creation": "2018-05-18 16:44:45"
						}
				]
		}
		
	4. Practitioner Role
	4.1 Get All Data
		URL : host:port/{apikey}/PractitionerRole
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/
		Response :
		{
				"err_code": 0,
				"data": [
				{
								"resourceType": "PractitionerRole",
								"id": "prrjgrqbsvb",
								"identifier": [
										{
												"id": "idejgrqbsvb",
												"use": "usual",
												"type": "BRN",
												"system": "idejgrqbsvb",
												"value": "340303173292074",
												"period": "2018-01-11 to 2019-01-11",
												"assigner": "null"
										}
								],
								"active": "true",
								"period": "2018-01-11 00:00:00 to 2019-01-11 00:00:00",
								"practitioner": "192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/practitioner?_id=prajf9h8zti",
								"organization": "192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/organization?_id=orgjf7woha6",
								"code": "doctor",
								"specialty": "408467006",
								"location": [
										{
												"id": "192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/location?_id=locjf9j2efw"
										}
								],
								"healthcareService": [],
								"telecom": [
										{
												"id": "copjgrqbsvb",
												"system": "phone",
												"value": "085616926724",
												"use": "mobile",
												"rank": "1",
												"period_start": "2018-01-11 00:00:00",
												"period_end": "2019-01-11 00:00:00"
										}
								],
								"availableTime": [
										{
												"id": "avtjgrqbsvb",
												"daysOfWeek": "mon",
												"allDay": "true",
												"availableTimeStart": "2019-01-11 00:00:00",
												"availableTimeEnd": "2019-01-11 00:00:00"
										}
								],
								"notAvailable": [
										{
												"id": "noajgrqbsvb",
												"description": "desc",
												"during": "2018-01-11 00:00:00"
										}
								],
								"practitioner_role_availability_exceptions": "exec",
								"endpoint": []
						}
				]
		}
		
	4.2 Get data by id
		URL : host:port/{apikey}/PractitionerRole?_id=value
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/PractitionerRole?_id=prrjfwc2af2
		Response :
		{
				"err_code": 0,
				"data": [
						{
								"resourceType": "PractitionerRole",
								"id": "prrjfwc2af2",
								"identifier": [
										{
												"id": "idejfwc2af2",
												"use": "usual",
												"type": "BRN",
												"system": "null",
												"value": "340303173292024",
												"period": "2018-01-11 to 2019-01-11",
												"assigner": "null"
										}
								],
								"active": "true",
								"period": "2018-01-11 00:00:00 to 2019-01-11 00:00:00",
								"practitioner": "192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/practitioner?_id=prajf9h8zti",
								"organization": "192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/organization?_id=orgjf7woha6",
								"code": "doctor",
								"specialty": "408467006",
								"location": [],
								"healthcareService": [],
								"telecom": [
										{
												"id": "copjfwc2af2",
												"system": "phone",
												"value": "085616926024",
												"use": "mobile",
												"rank": "1",
												"period_start": "2018-01-11 00:00:00",
												"period_end": "2019-01-11 00:00:00"
										}
								],
								"availableTime": [
										{
												"id": "avtjfwfy8hf",
												"daysOfWeek": "mon",
												"allDay": "true",
												"availableTimeStart": "2019-01-11 00:00:00",
												"availableTimeEnd": "2019-01-11 00:00:00"
										},
										{
												"id": "avtjfwg3s3e",
												"daysOfWeek": "mon",
												"allDay": "true",
												"availableTimeStart": "2019-01-11 00:00:00",
												"availableTimeEnd": "2019-01-11 00:00:00"
										}
								],
								"notAvailable": [
										{
												"id": "noajfwc2af2",
												"description": "desc",
												"during": "2018-01-11 00:00:00"
										}
								],
								"practitioner_role_availability_exceptions": "exec",
								"endpoint": []
						}
				]
		}
		
		
	4.3	Search Data
		URL : host:port/{apikey}/PractitionerRole?_id=practitioer_role.id&active=practitioner_role.active(true/false)&date=practitioner_role.period	&email=contact_point.where(system='email')	and	a	value	contact	is	an	email&endpoint=endpoint_id&identifier=identifier.value&location=location_id&organization=organization_id&phone=contact_point.where(system='phone')	and	a	value	contact	is	an	phone&practitioner=practitioner_id&role=practitioner_role.code&service=healthcare_service_id&speciality=practitioner_role.speciality&telecom=value	in	any	kind	of	contact
		
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/PractitionerRole?specialty=408467006
		Response :
		{
				"err_code": 0,
				"data": [
				{
								"resourceType": "PractitionerRole",
								"id": "prrjgrqbsvb",
								"identifier": [
										{
												"id": "idejgrqbsvb",
												"use": "usual",
												"type": "BRN",
												"system": "idejgrqbsvb",
												"value": "340303173292074",
												"period": "2018-01-11 to 2019-01-11",
												"assigner": "null"
										}
								],
								"active": "true",
								"period": "2018-01-11 00:00:00 to 2019-01-11 00:00:00",
								"practitioner": "192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/practitioner?_id=prajf9h8zti",
								"organization": "192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/organization?_id=orgjf7woha6",
								"code": "doctor",
								"specialty": "408467006",
								"location": [
										{
												"id": "192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/location?_id=locjf9j2efw"
										}
								],
								"healthcareService": [],
								"telecom": [
										{
												"id": "copjgrqbsvb",
												"system": "phone",
												"value": "085616926724",
												"use": "mobile",
												"rank": "1",
												"period_start": "2018-01-11 00:00:00",
												"period_end": "2019-01-11 00:00:00"
										}
								],
								"availableTime": [
										{
												"id": "avtjgrqbsvb",
												"daysOfWeek": "mon",
												"allDay": "true",
												"availableTimeStart": "2019-01-11 00:00:00",
												"availableTimeEnd": "2019-01-11 00:00:00"
										}
								],
								"notAvailable": [
										{
												"id": "noajgrqbsvb",
												"description": "desc",
												"during": "2018-01-11 00:00:00"
										}
								],
								"practitioner_role_availability_exceptions": "exec",
								"endpoint": []
						}
				]
		}
		
		
	4.4 Add Practitioner Role
		URL : host:port/{apikey}/PractitionerRole
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/
		body :
		{  
			"identifier":{
				"use": "usual",
				"type": "BRN",
				"value": "340303173292174",
				"period": "2018-01-11 to 2019-01-11"
			},  
			"active"  :  "true",  
			"period":  "2018-01-11 to 2019-01-11",
			"practitioner"  :  "prajf9h8zti",
			"organization"  :  "orgjf7woha6",
			"code"  :  "doctor",  
			"specialty"  :  "408467006",  
			"location"  :  "locjf9j2efw",  
			"healthcareService"  :  "",  
			"telecom":{
				"system":"phone",
				"value":"085616921724",
				"use":  "mobile",
				"rank":  "1",
				"period":"2018-01-11 to 2019-01-11"
			},  
			"availableTime"  :  {  
				"daysOfWeek"  :  "mon",  
				"allDay"  :  "true",  
				"availableStartTime"  :  "2018-01-11",  
				"availableEndTime"  :  "2019-01-11"  
			},  
			"notAvailable"  :  {  
			"description"  :  "desc",  
			"during"  : "2018-01-11"
			},  
			"availabilityExceptions"  :  "exec",  
			"endpoint"  :  ""  
		}  
		Response :
		{
				"err_code": 0,
				"err_msg": "Practitioner Role has been add.",
				"data": [
						{
								"_id": "prrjhcv17yo"
						}
				]
		}
	4.5 Add Practitioner Role AvailableTime
		URL : host:port/{apikey}/PractitionerRole/:practitioner_role_id?/AvailableTime
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/PractitionerRole/prrjfwc2af2/AvailableTime
		body :
		{  
			"daysOfWeek"  :  "mon",  
			"allDay"  :  "true",  
			"availableStartTime"  :  "2018-01-11",  
			"availableEndTime"  :  "2019-01-11"  
		}
		Response :
		{
				"err_code": 0,
				"err_msg": "Available Time has been add in this practitioner role.",
				"data": [
						{
								"available_time_id": "avtjhcv2xau",
								"available_time_day_of_week": "mon",
								"available_time_all_day": "true",
								"available_time_start": "2019-01-11 00:00:00",
								"available_time_end": "2019-01-11 00:00:00",
								"practitioner_role_id": "prrjfwc2af2"
						}
				]
		}
	4.6 Add Practitioner Role NotAvailable
		URL : host:port/{apikey}/PractitionerRole/:practitioner_role_id?/NotAvailable
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/PractitionerRole/prrjfwc2af2/NotAvailable
		body :
		{  
			"description"  :  "desc",  
			"during"  : "2018-01-11"  
		}
		Response :
		{
				"err_code": 0,
				"err_msg": "Not Available has been add in this practitioner role.",
				"data": [
						{
								"not_available_id": "noajhcvioll",
								"not_available_description": "desc",
								"not_available_during": "2018-01-11 00:00:00"
						}
				]
		}
	4.7 Add Practitioner Role Identifier
		URL : host:port/{apikey}/PractitionerRole/:practitioner_role_id?/Identifier
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/PractitionerRole/prrjfwc2af2/Identifier
		body :
		{
			"use": "usual",
			"type": "BRN",
			"value": "3403031732927449",
			"period": "2018-01-11 to 2019-01-11"
		}
		Response :
		{
				"err_code": 0,
				"err_msg": "Identifier has been add in this practitioner role.",
				"data": [
						{
								"id": "idejhcvofvi",
								"use": "usual",
								"type": "BRN",
								"system": "idejhcvofvi",
								"value": "3403031732927449",
								"period": "2018-01-11 to 2019-01-11"
						}
				]
		}
	4.8 Add Practitioner Role Telecom
		URL : host:port/{apikey}/PractitionerRole/:practitioner_role_id?/Telecom
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/PractitionerRole/prrjfwc2af2/Telecom
		body :
		{
			"system": "phone",
			"value": "085713324387",
			"use": "mobile",
			"rank":"1",
			"period": "2018-01-11 to 2019-01-11"
		}
		Response :
		{
				"err_code": 0,
				"err_msg": "Telecom has been add in this practitioner role.",
				"data": [
						{
								"id": "cpjhcvroil",
								"system": "phone",
								"value": "085713324387",
								"use": "mobile",
								"rank": "1",
								"period": ""
						}
				]
		}
	4.9 Add Practitioner Role Endpoint
		URL : host:port/{apikey}/PractitionerRole/:practitioner_role_id?/Endpoint
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/PractitionerRole/prrjfwc2af2/Endpoint
		body :
		{
			"endpoint_id" : "enpjfrxsdrn"
		}
		Response :
		{
				"err_code": 0,
				"err_msg": "Endpoint has been add in this practitioner role.",
				"data": [
						{
								"endpoint_id": "enpjfrxsdrn",
								"practitioner_role_id": "prrjfwc2af2"
						}
				]
		}
	4.10 Add Practitioner Role Location
		URL : host:port/{apikey}/PractitionerRole/:practitioner_role_id?/Location
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/PractitionerRole/prrjfwc2af2/Location
		body :
		{
			"location_id" : "locjfktm8ud"
		}
		Response :
		{
				"err_code": 0,
				"err_msg": "Location has been add in this practitioner role.",
				"data": [
						{
								"location_id": "locjfktm8ud",
								"practitioner_role_id": "prrjfwc2af2"
						}
				]
		}
	4.11 Add Practitioner Role HealthcareService
		URL : host:port/{apikey}/PractitionerRole/:practitioner_role_id?/HealthcareService
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/PractitionerRole/prrjfwc2af2/HealthcareService
		body : 
		{
			"healthcare_service_id" : "hcsjfaqiu7t"
		}
		Response :
		{
				"err_code": 0,
				"err_msg": "Healthcare Service has been add in this practitioner role.",
				"data": [
						{
								"healthcare_service_id": "hcsjfaqiu7t",
								"practitioner_role_id": "prrjfwc2af2"
						}
				]
		}
	4.12 Put Practitioner Role
		URL : host:port/{apikey}/PractitionerRole/:practitioner_role_id?
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/PractitionerRole/prrjf9id78s
		body :
		{
			"active": "false",
			"period":  "2018-01-11 to 2019-01-11",
			"practitioner"  :  "prajf9h8zti",
			"organization"  :  "orgjf7woha6",
			"code"  :  "doctor",  
			"specialty"  :  "408467006",
			"availabilityExceptions"  :  "exec"
		}
		Response :
		{
			"err_code": 0,
			"err_msg": "Practitioner role has been update.",
			"data": [
					{
							"practitioner_id": "prajf9h8zti",
							"practitioner_role_active": "false",
							"practitioner_role_code": "doctor",
							"practitioner_role_specialty": "408467006",
							"practitioner_role_availability_exceptions": "exec",
							"practitioner_role_period_start": "2018-01-11 00:00:00",
							"practitioner_role_period_end": "2019-01-11 00:00:00",
							"organization_id": "orgjf7woha6"
					}
			]
		}
	4.14 Put Practitioner Role AvailableTime
		URL : host:port/{apikey}/PractitionerRole/:practitioner_role_id?/AvailableTime/:available_time_id?
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/PractitionerRole/prrjfwc2af2/AvailableTime/avtjhcv2xau
		body :
		{  
			"daysOfWeek"  :  "mon",  
			"allDay"  :  "true",  
			"availableStartTime"  :  "2018-01-11",  
			"availableEndTime"  :  "2019-01-11"  
		}
		Response :
		{
				"err_code": 0,
				"err_msg": "available time has been update in this practitioner role.",
				"data": [
						{
								"available_time_id": "avtjhcv2xau",
								"available_time_day_of_week": "mon",
								"available_time_all_day": "true",
								"available_time_start": "2019-01-11 00:00:00",
								"available_time_end": "2019-01-11 00:00:00",
								"practitioner_role_id": "prrjfwc2af2"
						}
				]
		}
	4.15 Put Practitioner Role NotAvailable
		URL : host:port/{apikey}/PractitionerRole/:practitioner_role_id?/NotAvailable/:not_available_id?
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/PractitionerRole/prrjfwc2af2/NotAvailable/noajhcvioll
		body :
		{  
			"description"  :  "description",  
			"during"  : "2018-01-11"  
		}
		Response :
		{
				"err_code": 0,
				"err_msg": "not available has been update in this practitioner role.",
				"data": [
						{
								"not_available_id": "noajhcvioll",
								"not_available_description": "description",
								"not_available_during": "2018-01-11 00:00:00"
						}
				]
		}
	4.16 Put Practitioner Role Identifier
		URL : host:port/{apikey}/PractitionerRole/:practitioner_role_id?/Identifier/:identifier_id?
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/PractitionerRole/prrjfwc2af2/Identifier/idejhcvofvi
		body :
		{
			"use": "usual",
			"type": "BRN",
			"value": "3403031732927448",
			"period": "2018-01-11 to 2019-01-11"
		}
		Response :
		{
				"err_code": 0,
				"err_msg": "Identifier has been update in this practitioner role.",
				"data": [
						{
								"id": "idejhcvofvi",
								"use": "usual",
								"type": "BRN",
								"system": "idejhcvofvi",
								"value": "3403031732927448",
								"period": "2018-01-11 to 2019-01-11"
						}
				]
		}
		
	4.17 Put Practitioner Role Telecom
		URL : host:port/{apikey}/PractitionerRole/:practitioner_role_id?/Telecom/:contact_point_id?
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/PractitionerRole/prrjfwc2af2/Telecom/cpjhcw61nh
		body :
		{
			"system": "phone",
			"value": "085713324384",
			"use": "mobile",
			"rank":"1",
			"period": "2018-01-11 to 2019-01-11"
		}
		Response :
		{
				"err_code": 0,
				"err_msg": "Telecom has been update in this practitioner role.",
				"data": [
						{
								"id": "cpjhcw61nh",
								"system": "phone",
								"value": "085713324384",
								"use": "mobile",
								"rank": "1",
								"period": ""
						}
				]
		}
	
	5. Healthcare Service
	5.1 Get All Data
		URL : host:port/{apikey}/HealthcareService
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/HealthcareService
		Response :
		{
				"err_code": 0,
				"data": [
				 {
								"resourceType": "HealthcareService",
								"id": "hcsjfaqjxem",
								"identifier": [
										{
												"id": "idejfaqjxem",
												"use": "usual",
												"type": "BRN",
												"system": "null",
												"value": "340303173292772",
												"period": "2018-01-11 to 2019-01-11",
												"assigner": "null"
										}
								],
								"active": "false",
								"providedBy": "orgjf7woha6",
								"category": "1",
								"type": "1",
								"specialty": "408467006",
								"location": [],
								"name": "hcshealthcareservice",
								"comment": "mantabs",
								"extraDetails": "extradetails",
								"photo": [
										{
												"id": "attjfaqjxem",
												"type": "image/jpg",
												"language": "en",
												"url": "attjfaqjxem",
												"size": "446996",
												"hash": "5488a8e1ba237d77d715a21b41b8966591aa85f5",
												"title": "vlcsnap-2017-06-16-20h06m22s006.png",
												"data": "+miUBUWmsj/D1AV/aZuvTE6AAAAAElFTkSuQmCC",
												"creation": "2018-03-28 13:55:14"
										}
								],
								"telecom": [
										{
												"id": "copjfaqjxem",
												"system": "phone",
												"value": "085616923277",
												"use": "mobile",
												"rank": "1",
												"period_start": "2018-01-11 00:00:00",
												"period_end": "2019-01-11 00:00:00"
										}
								],
								"coverageArea": [],
								"serviceProvisionCode": "free",
								"eligibility": "required",
								"eligibilityNote": "describestheeligibilityconditionsfortheservice",
								"programName": "programnamesthatcategorizetheservice",
								"characteristic": "required",
								"appointmentRequired": "fax",
								"availableTime": [],
								"notAvailable": [
										{
												"id": "noajfaqjxem",
												"description": "desc",
												"during": "2018-01-11 00:00:00"
										}
								],
								"availabilityExceptions": "availabilityexceptions",
								"endpoint": []
						}
				]
		}
	5.2 Get data by id
		URL : host:port/{apikey}/HealthcareService?_id=value
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/HealthcareService?_id=hcsjfaqjxem
		Response :
		{
				"err_code": 0,
				"data": [
						{
								"resourceType": "HealthcareService",
								"id": "hcsjfaqjxem",
								"identifier": [
										{
												"id": "idejfaqjxem",
												"use": "usual",
												"type": "BRN",
												"system": "null",
												"value": "340303173292772",
												"period": "2018-01-11 to 2019-01-11",
												"assigner": "null"
										}
								],
								"active": "false",
								"providedBy": "orgjf7woha6",
								"category": "1",
								"type": "1",
								"specialty": "408467006",
								"location": [],
								"name": "hcshealthcareservice",
								"comment": "mantabs",
								"extraDetails": "extradetails",
								"photo": [
										{
												"id": "attjfaqjxem",
												"type": "image/jpg",
												"language": "en",
												"url": "attjfaqjxem",
												"size": "446996",
												"hash": "5488a8e1ba237d77d715a21b41b8966591aa85f5",
												"title": "vlcsnap-2017-06-16-20h06m22s006.png",
												"data": "+miUBUWmsj/D1AV/aZuvTE6AAAAAElFTkSuQmCC",
												"creation": "2018-03-28 13:55:14"
										}
								],
								"telecom": [
										{
												"id": "copjfaqjxem",
												"system": "phone",
												"value": "085616923277",
												"use": "mobile",
												"rank": "1",
												"period_start": "2018-01-11 00:00:00",
												"period_end": "2019-01-11 00:00:00"
										}
								],
								"coverageArea": [],
								"serviceProvisionCode": "free",
								"eligibility": "required",
								"eligibilityNote": "describestheeligibilityconditionsfortheservice",
								"programName": "programnamesthatcategorizetheservice",
								"characteristic": "required",
								"appointmentRequired": "fax",
								"availableTime": [],
								"notAvailable": [
										{
												"id": "noajfaqjxem",
												"description": "desc",
												"during": "2018-01-11 00:00:00"
										}
								],
								"availabilityExceptions": "availabilityexceptions",
								"endpoint": []
						}
				]
		}
	5.3	Search Data
		URL : host:port/{apikey}/HealthcareService?_id=healthcare_service.id&active=healthcare_service..active(true/false)&category=healthcare_service.category&characteristic=healthcare_service.characteristic&endpoint=healthcare_service.endpoint&identifier=identifier.value&location=location_id&name=healthcare_service.name&organization=organization_id&program_name=healthcare_service.program_name&type=healthcare_service.type		
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/HealthcareService?category=1
		Response :
		{
				"err_code": 0,
				"data": [
				{
								"resourceType": "HealthcareService",
								"id": "hcsjfaqjxem",
								"identifier": [
										{
												"id": "idejfaqjxem",
												"use": "usual",
												"type": "BRN",
												"system": "null",
												"value": "340303173292772",
												"period": "2018-01-11 to 2019-01-11",
												"assigner": "null"
										}
								],
								"active": "false",
								"providedBy": "orgjf7woha6",
								"category": "1",
								"type": "1",
								"specialty": "408467006",
								"location": [],
								"name": "hcshealthcareservice",
								"comment": "mantabs",
								"extraDetails": "extradetails",
								"photo": [
										{
												"id": "attjfaqjxem",
												"type": "image/jpg",
												"language": "en",
												"url": "attjfaqjxem",
												"size": "446996",
												"hash": "5488a8e1ba237d77d715a21b41b8966591aa85f5",
												"title": "vlcsnap-2017-06-16-20h06m22s006.png",
												"data": "+miUBUWmsj/D1AV/aZuvTE6AAAAAElFTkSuQmCC",
												"creation": "2018-03-28 13:55:14"
										}
								],
								"telecom": [
										{
												"id": "copjfaqjxem",
												"system": "phone",
												"value": "085616923277",
												"use": "mobile",
												"rank": "1",
												"period_start": "2018-01-11 00:00:00",
												"period_end": "2019-01-11 00:00:00"
										}
								],
								"coverageArea": [],
								"serviceProvisionCode": "free",
								"eligibility": "required",
								"eligibilityNote": "describestheeligibilityconditionsfortheservice",
								"programName": "programnamesthatcategorizetheservice",
								"characteristic": "required",
								"appointmentRequired": "fax",
								"availableTime": [],
								"notAvailable": [
										{
												"id": "noajfaqjxem",
												"description": "desc",
												"during": "2018-01-11 00:00:00"
										}
								],
								"availabilityExceptions": "availabilityexceptions",
								"endpoint": []
						}
				]
		}
	5.4 Add Healthcare Service 
		URL : host:port/{apikey}/HealthcareService
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/HealthcareService
		body :
		{
			"identifier":{
				"use":"usual",
				"type":"BRN",
				"value":"340303273292772",
				"period":"2018-01-11to2019-01-11"
			},
			"active":"true",
			"providedBy":"orgjf7woha6",
			"category":"1",
			"type":"1",
			"specialty":"408467006",
			"location":"locjf9j2efw",
			"name":"hcshealthcareservice",
			"comment":"mantabs",
			"extraDetails":"Extradetails",
			"photo":{
				"content_type":"image/jpg",
				"language":"en",
				"size":"446996",
				"title":"vlcsnap-2017-06-16-20h06m22s006.png",
				"data":"+miUBUWmsj/D1AV/aZuvTE6AAAAAElFTkSuQmCC"
			},
			"telecom":{
				"system":"phone",
				"value":"085626923277",
				"use":"mobile",
				"rank":"1",
				"period":"2018-01-11to2019-01-11"
			},
			"coverageArea":"locjf9j2efw",
			"serviceProvisionCode":"free",
			"eligibility":"required",
			"eligibilityNote":"Describestheeligibilityconditionsfortheservice",
			"programName":"ProgramNamesthatcategorizetheservice",
			"characteristic":"required",
			"referralMethod":"fax",
			"appointmentRequired":"true",
			"availableTime":{
				"daysOfWeek":"mon",
				"allDay":"true",
				"availableStartTime":"2018-01-11",
				"availableEndTime":"2019-01-11"
			},
			"notAvailable":{
				"description":"desc",
				"during":"2018-01-11"
			},
			"availabilityExceptions":"availabilityExceptions",
			"endpoint":""
		}
		Response :
		{
				"err_code": 0,
				"err_msg": "Healthcare Service has been add.",
				"data": [
						{
								"_id": "hcsjhcwufmd"
						}
				]
		}
	5.5 Add Healthcare Service AvailableTime
		URL : host:port/{apikey}/HealthcareService/:healthcare_service_id?/AvailableTime
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/HealthcareService/hcsjhcwufmd/AvailableTime
		body :
		{  
			"daysOfWeek"  :  "mon",  
			"allDay"  :  "true",  
			"availableStartTime"  :  "2018-01-11",  
			"availableEndTime"  :  "2019-01-11"  
		}
		Response :
		{
			"err_code": 0,
			"err_msg": "Available Time has been add in this Healthcare Service.",
			"data": [
					{
							"available_time_id": "avtjhcxbexq",
							"available_time_day_of_week": "mon",
							"available_time_all_day": "true",
							"available_time_start": "2019-01-11 00:00:00",
							"available_time_end": "2019-01-11 00:00:00",
							"practitioner_role_id": "null"
					}
			]
	}
	5.6 Add Healthcare Service NotAvailable
		URL : host:port/{apikey}/HealthcareService/:healthcare_service_id?/NotAvailable
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/HealthcareService/hcsjhcwufmd/NotAvailable
		body :
		{  
			"description"  :  "description",  
			"during"  : "2018-01-11"  
		}
		Response :
		{
				"err_code": 0,
				"err_msg": "Not Available has been add in this healthcare service.",
				"data": [
						{
								"not_available_id": "noajhcxb044",
								"not_available_description": "description",
								"not_available_during": "2018-01-11 00:00:00"
						}
				]
		}
	5.7 Add Healthcare Service Identifier
		URL : host:port/{apikey}/HealthcareService/:healthcare_service_id?/Identifier
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/HealthcareService/hcsjhcwufmd/Identifier
		body : 
		{
			"use": "usual",
			"type": "BRN",
			"value": "3403031732927439",
			"period": "2018-01-11 to 2019-01-11"
		}
		Response : 
		{
				"err_code": 0,
				"err_msg": "Identifier has been add in this healthcare service.",
				"data": [
						{
								"id": "idejhcxfth5",
								"use": "usual",
								"type": "BRN",
								"system": "idejhcxfth5",
								"value": "3403031732927439",
								"period": "2018-01-11 to 2019-01-11"
						}
				]
		}
	5.8 Add Healthcare Service Telecom
		URL : host:port/{apikey}/HealthcareService/:healthcare_service_id?/Telecom
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/HealthcareService/hcsjhcwufmd/Telecom
		body :
		{
			"system": "phone",
			"value": "085713324346",
			"use": "mobile",
			"rank":"1",
			"period": "2018-01-11 to 2019-01-11"
		}
		Response :
		{
				"err_code": 0,
				"err_msg": "Telecom has been add in this Healthcare Service.",
				"data": [
						{
								"id": "cpjhcxg902",
								"system": "phone",
								"value": "085713324346",
								"use": "mobile",
								"rank": "1",
								"period": ""
						}
				]
		}
	5.9 Add Healthcare Service Endpoint
		URL : host:port/{apikey}/HealthcareService/:healthcare_service_id?/Endpoint
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/HealthcareService/hcsjfams35u/Endpoint
		body :
		{
			"endpoint_id" : "enpjfrxsdrn"
		}
		Response :
		{
				"err_code": 0,
				"err_msg": "Endpoint has been add in this healthcare service.",
				"data": [
						{
								"endpoint_id": "enpjfrxsdrn",
								"healthcare_service_id": "hcsjfams35u"
						}
				]
		}
	5.10 Add Healthcare Service Location
		URL : host:port/{apikey}/HealthcareService/:healthcare_service_id?/Location
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/HealthcareService/hcsjfams35u/Location
		body :
		{
			"location_id" : "locjf9j2efw"
		}
		Response :
		{
				"err_code": 0,
				"err_msg": "Location has been add in this healthcare service.",
				"data": [
						{
								"location_id": "locjf9j2efw",
								"location_healthcare_service_location": "hcsjfams35u"
						}
				]
		}
	5.11 Add Healthcare Service CoverageArea
		URL : host:port/{apikey}/HealthcareService/:healthcare_service_id?/CoverageArea
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/HealthcareService/hcsjfams35u/CoverageArea
		body :
		{
			"location_id" : "locjf9j2efw"
		}
		Response :
		{
				"err_code": 0,
				"err_msg": "Location Coverage Area has been add in this healthcare service.",
				"data": [
						{
								"location_id": "locjf9j2efw",
								"location_healthcare_service_coverage_area": "hcsjfams35u"
						}
				]
		}
	5.12 Put Healthcare Service 
		URL : host:port/{apikey}/HealthcareService/:healthcare_service_id?
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/HealthcareService/hcsjhcwufmd
		body :
		{
			"active":"true",
			"providedBy":"orgjf7woha6",
			"category":"1",
			"type":"1",
			"specialty":"408467006",
			"name":"hcshealthcareservice",
			"comment":"mantabs",
			"extraDetails":"Extradetails",
			"serviceProvisionCode":"free",
			"eligibility":"required",
			"eligibilityNote":"Describestheeligibilityconditionsfortheservice",
			"programName":"ProgramNamesthatcategorizetheservice",
			"characteristic":"required",
			"referralMethod":"fax",
			"appointmentRequired":"true",
			"availabilityExceptions":"availabilityExceptions"
		}
		Response :
		{
				"err_code": 0,
				"err_msg": "Healthcare service has been update.",
				"data": [
						{
								"healthcare_service_id": "hcsjhcwufmd",
								"healthcare_service_active": "true",
								"healthcare_service_category": "1",
								"healthcare_service_type": "1",
								"healthcare_service_specialty": "408467006",
								"healthcare_service_name": "hcshealthcareservice",
								"healthcare_service_comment": "mantabs",
								"healthcare_service_extra_details": "extradetails",
								"healthcare_service_service_provision_code": "free",
								"healthcare_service_eligibility": "required",
								"healthcare_service_eligibility_note": "describestheeligibilityconditionsfortheservice",
								"healthcare_service_program_name": "programnamesthatcategorizetheservice",
								"healthcare_service_characteristic": "required",
								"healthcare_service_referral_method": "fax",
								"healthcare_service_appointegerment_required": "true",
								"healthcare_service_availability_exceptions": "availabilityexceptions",
								"organization_id": "orgjf7woha6",
								"attachment_id": "attjhcwufmd"
						}
				]
		}
	5.12 Put Healthcare Service AvailableTime
		URL : host:port/{apikey}/HealthcareService/:healthcare_service_id?/AvailableTime/:available_time_id?
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/HealthcareService/hcsjhcwufmd/AvailableTime/avtjhcxbexq
		body :
		{  
			"daysOfWeek"  :  "mon",  
			"allDay"  :  "true",  
			"availableStartTime"  :  "2018-01-11",  
			"availableEndTime"  :  "2019-01-11"  
		}
		Response :
		{
				"err_code": 0,
				"err_msg": "available time has been update in this Healthcare Service Id.",
				"data": [
						{
								"available_time_id": "avtjhcxbexq",
								"available_time_day_of_week": "mon",
								"available_time_all_day": "true",
								"available_time_start": "2019-01-11 00:00:00",
								"available_time_end": "2019-01-11 00:00:00",
								"practitioner_role_id": "null"
						}
				]
		}
	5.12 Put Healthcare Service NotAvailable
		URL : host:port/{apikey}/HealthcareService/:healthcare_service_id?/NotAvailable/:not_available_id?
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/HealthcareService/hcsjhcwufmd/NotAvailable/noajhcxb044
		body :
		{  
			"description"  :  "description",  
			"during"  : "2018-01-11"  
		}
		Response :
		{
				"err_code": 0,
				"err_msg": "not available has been update in this healthcare service.",
				"data": [
						{
								"not_available_id": "noajhcxb044",
								"not_available_description": "description",
								"not_available_during": "2018-01-11 00:00:00"
						}
				]
		}
		
	5.12 Put Healthcare Service Identifier
		URL : host:port/{apikey}/HealthcareService/:healthcare_service_id?/Identifier/:identifier_id?
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/HealthcareService/hcsjhcwufmd/Identifier/idejhcxfth5
		body :
		{
			"use": "usual",
			"type": "BRN",
			"value": "3403031732927434",
			"period": "2018-01-11 to 2019-01-11"
		}
		Response :
		{
				"err_code": 0,
				"err_msg": "Identifier has been update in this healthcare service.",
				"data": [
						{
								"id": "idejhcxfth5",
								"use": "usual",
								"type": "BRN",
								"system": "idejhcxfth5",
								"value": "3403031732927434",
								"period": "2018-01-11 to 2019-01-11"
						}
				]
		}
	5.12 Put Healthcare Service Telecom
		URL : host:port/{apikey}/HealthcareService/:healthcare_service_id?/Telecom/:contact_point_id?
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/HealthcareService/hcsjhcwufmd/Telecom/cpjhcxg902
		body :
		{
			"system": "phone",
			"value": "085713324344",
			"use": "mobile",
			"rank":"1",
			"period": "2018-01-11 to 2019-01-11"
		}
		Response :
		{
				"err_code": 0,
				"err_msg": "Telecom has been update in this healthcare service.",
				"data": [
						{
								"id": "cpjhcxg902",
								"system": "phone",
								"value": "085713324344",
								"use": "mobile",
								"rank": "1",
								"period": ""
						}
				]
		}
	5.12 Put Healthcare Service Photo
		URL : host:port/{apikey}/HealthcareService/:healthcare_service_id?/Photo/:attachment_id?
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/HealthcareService/hcsjhcwufmd/Photo/attjhcwufmd
		body :
		{
			"content_type" : "image/png",
			"language":"en",
			"size":  "446996",
			"title":"vlcsnap-2017-06-16-20h06m22s006.png",
			"data":  "+miUBUWmsj/D1AV/aZuvTE6AAAAAElFTkSuQmCC"
		}
		Response :
		{
				"err_code": 0,
				"err_msg": "Photo has been update in this healthcare service.",
				"data": [
						{
								"id": "attjhcwufmd",
								"url": "attjhcwufmd",
								"contentType": "image/png",
								"language": "en",
								"data": "+miUBUWmsj/D1AV/aZuvTE6AAAAAElFTkSuQmCC",
								"size": "446996",
								"hash": "5488a8e1ba237d77d715a21b41b8966591aa85f5",
								"title": "vlcsnap-2017-06-16-20h06m22s006.png",
								"creation": "2018-05-19 11:46:19"
						}
				]
		}
	
	6. Endpoint
	6.1 Get All Data
		URL : host:port/{apikey}/Endpoint
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/
		Response :
		{
				"err_code": 0,
				"data": [
				{
								"resourceType": "Endpoint",
								"id": "enpjfrxtozy",
								"identifier": [
										{
												"id": "idejfrxtozy",
												"use": "usual",
												"type": "BRN",
												"system": "idejfrxtozy",
												"value": "3404101301911282",
												"period": "2018-01-11 to 2023-01-11",
												"assigner": "null"
										}
								],
								"status": "active",
								"connectionType": "ihexcpd",
								"name": "name endpoint",
								"managingOrganization": "192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/Organization?_id=orgjf7wxdoe",
								"contact": [
										{
												"id": "copjfrxtozy",
												"system": "phone",
												"value": "08512345682",
												"use": "mobile",
												"rank": "1",
												"period_start": "2018-01-11 00:00:00",
												"period_end": "2019-01-11 00:00:00"
										}
								],
								"period": "2018-01-11 00:00:00 to 2019-01-11 00:00:00",
								"payloadType": "urn:ihe:pcc:handp:2008",
								"payloadMimeType": "text/html",
								"address": "192.168.1.228/pacs",
								"header": "pacs"
						}
				]
		}
	6.2 Get data by id
		URL : host:port/{apikey}/Endpoint?_id
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/endpoint?_id=enpjfjj4s45
		Response : 
		{
				"err_code": 0,
				"data": [
						{
								"resourceType": "Endpoint",
								"id": "enpjfjj4s45",
								"identifier": [
										{
												"id": "idejfjj4s45",
												"use": "usual",
												"type": "BRN",
												"system": "idejfjj4s45",
												"value": "3404101301011282",
												"period": "2018-01-11 to 2023-01-11",
												"assigner": "null"
										}
								],
								"status": "suspended",
								"connectionType": "ihexcpd",
								"name": "name endpoint",
								"managingOrganization": "192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/Organization?_id=orgjf7woha6",
								"contact": [
										{
												"id": "copjfjj4s45",
												"system": "phone",
												"value": "08512345680",
												"use": "mobile",
												"rank": "1",
												"period_start": "2018-01-11 00:00:00",
												"period_end": "2019-01-11 00:00:00"
										}
								],
								"period": "2018-01-11 00:00:00 to 2019-01-11 00:00:00",
								"payloadType": "urn:ihe:pcc:handp:2008",
								"payloadMimeType": "text/html",
								"address": "192.168.1.228/pacs",
								"header": "pacs"
						}
				]
		}
	6.3	Search Data
		URL : host:port/{apikey}/Endpoint?_id=endpoint.id&connection_type=endpoint.connection_type&identifier=identifier.value&name=endpoint.name&organization=organization_id&payload_type=endpoint.payload_type&status=endpoint.status
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/endpoint?organization=orgjf7woha6
		Response : 
		{
				"err_code": 0,
				"data": [
						{
								"resourceType": "Endpoint",
								"id": "enpjfrxsdrn",
								"identifier": [
										{
												"id": "idejfrxsdrn",
												"use": "usual",
												"type": "BRN",
												"system": "idejfrxsdrn",
												"value": "3404101301911283",
												"period": "2018-01-11 to 2023-01-11",
												"assigner": "null"
										}
								],
								"status": "active",
								"connectionType": "ihexcpd",
								"name": "name endpoint",
								"managingOrganization": "192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/Organization?_id=orgjf7woha6",
								"contact": [
										{
												"id": "copjfrxsdrn",
												"system": "phone",
												"value": "08512345683",
												"use": "mobile",
												"rank": "1",
												"period_start": "2018-01-11 00:00:00",
												"period_end": "2019-01-11 00:00:00"
										}
								],
								"period": "2018-01-11 00:00:00 to 2019-01-11 00:00:00",
								"payloadType": "urn:ihe:pcc:handp:2008",
								"payloadMimeType": "text/html",
								"address": "192.168.1.228/pacs",
								"header": "pacs"
						}
				]
		}

		_id;
		connection_type;
		identifier;
		name;
		organization;
		payload_type;
		status;
	6.4 Add Endpoint
		URL : host:port/{apikey}/Endpoint
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/Endpoint
		body : 
		{
			"identifier": 
				{
					"use": "usual",
					"type": "BRN",
					"value": "3404101301911289",
					"period": "2018-01-11 to 2023-01-11",
					"assigner": "orgjd33k2k4"

				},
			"status": "active",
			"connectionType": "ihexcpd",
			"name": "name endpoint",
			"managingOrganization": "orgjf7wxdoe",
			"contact": 
				{
					"system": "phone",
					"value": "08512345689",
					"use": "mobile",
					"rank": "1",
					"period": "2018-01-11 00:00:00 to 2019-01-11 00:00:00"

				},
			"period" : "2018-01-11 00:00:00 to 2019-01-11 00:00:00",  
			"payloadType": "urn:ihe:pcc:handp:2008",
			"payloadMimeType": "text/html",
			"address": "192.168.1.228/pacs",
			"header": "pacs"
		}
		Response : 
		{
				"err_code": 0,
				"err_msg": "Endpoint has been add.",
				"data": [
						{
								"_id": "enpjhblgfmk"
						}
				]
		}
	6.5 Add Endpoint Identifier
		URL : host:port/{apikey}/Endpoint/:endpoint_id?/Identifier
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/endpoint/enpjfjj4s45/Identifier
		body : 
		{
			"use": "usual",
			"type": "BRN",
			"value": "3403031732917429",
			"period": "2018-01-11 to 2019-01-11"
		}
		Response :
		{
				"err_code": 0,
				"err_msg": "Identifier has been add in this endpoint.",
				"data": [
						{
								"id": "idejhbod1ih",
								"use": "usual",
								"type": "BRN",
								"system": "idejhbod1ih",
								"value": "3403031732917429",
								"period": "2018-01-11 to 2019-01-11"
						}
				]
		}
		
	6.6 Add Endpoint Telecom
		URL : host:port/{apikey}/Endpoint/:endpoint_id?/Telecom
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/Endpoint/:endpoint_id?/Telecom
		body :
		{
			"system": "phone",
			"value": "085713322727",
			"use": "mobile",
			"rank":"1",
			"period": "2018-01-11 to 2019-01-11"
		}
		Response :
		{
				"err_code": 0,
				"err_msg": "Telecom has been add in this endpoint.",
				"data": [
						{
								"id": "cpjhboeon7",
								"system": "phone",
								"value": "085713322727",
								"use": "mobile",
								"rank": "1",
								"period": ""
						}
				]
		}
	6.7 Put Endpoint
		URL : host:port/{apikey}/Endpoint
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/
		body :
		{
			"status":"suspended",
			"connectionType":"ihexcpd",
			"name":"endpointname",
			"managingOrganization":"orgjf7woha6",
			"payloadType":"urn:ihe:pcc:handp:2008",
			"payloadMimeType":"text/html",
			"period":"2018-01-11 00:00:00 to 2019-01-11 00:00:00",
			"address":"192.168.1.228/pacs",
			"header":"pacs"
		}
		Response :
		{
				"err_code": 0,
				"err_msg": "Endpoint has been update.",
				"data": [
						{
								"_id": "enpjfjj4s45"
						}
				]
		}
	6.8 Put Endpoint Identifier
		URL : host:port/{apikey}/Endpoint/:endpoint_id?/Identifier/:identifier_id?
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/
		body :
		{
			"use": "usual",
			"type": "BRN",
			"system": "idejfjj4s45",
			"value": "3404101301011280",
			"period": "2018-01-11 to 2023-01-11"
		}
		Response :
		{
				"err_code": 0,
				"err_msg": "Identifier has been update in this endpoint.",
				"data": [
						{
								"id": "idejfjj4s45",
								"use": "usual",
								"type": "BRN",
								"system": "idejfjj4s45",
								"value": "3404101301011280",
								"period": "2018-01-11 to 2023-01-11"
						}
				]
		}
	6.9 Put Endpoint Telecom
		URL : host:port/{apikey}/Endpoint/:endpoint_id?/Telecom/:contact_point_id?
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/endpoint/enpjfjj4s45/Telecom/cpjhbogve2
		body :
		{
			"system": "phone",
			"value": "08571332446",
			"use": "mobile",
			"rank":"1",
			"period": "2018-01-11 to 2019-01-11"
		}
		Response :
		{
				"err_code": 0,
				"err_msg": "Telecom has been update in this endpoint.",
				"data": [
						{
								"id": "cpjhbogve2",
								"system": "phone",
								"value": "08571332446",
								"use": "mobile",
								"rank": "1",
								"period": ""
						}
				]
		}
	