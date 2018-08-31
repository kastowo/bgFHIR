Default FHIR

1. adverse-event-category
	a. get all data
		Method : GET 
		Url format : host:port/{apikey}/adverse-event-category
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/adverse-event-category

	b. get by id
		Method : GET
		Url format : host:port/{apikey}/adverse-event-category/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/adverse-event-category/130
	
	c. Get data by code
		Method : GET
		Url format : host:port/{apikey}/adverse-event-category/code/{code}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/adverse-event-category/code/AE
		
	d. Add 
		Method : POST
		Url format : host:port/{apikey}/adverse-event-category
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/adverse-event-category
		body : 
			{
				"code" : "ae",
				"display" : "Adverse Event",
				"definition" : ""
			}
			
		response : 
		{
				"err_code": 0,
				"err_msg": "Adverse Event Category has been add.",
				"data": [
						{
								"id": "130",
								"code": "AE",
								"display": "Adverse Event",
								"definition": "null"
						}
				]
		}
		
		Keterangan :
			Data yang harus ditambahkan pada API ini dapat dilihat pada link ini https://www.hl7.org/fhir/valueset-adverse-event-category.html
			
	e. put
		Method : PUT
		Url format : host:port/{apikey}/adverse-event-category/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/adverse-event-category/130
		body:
		{
				"code" : "ae",
				"display" : "Adverse Event",
				"definition" : "Adverse Event"
			}
		response : 
		{
			"err_code": 0,
			"err_msg": "Adverse Event Category has been update.",
			"data": [
					{
							"id": "130",
							"code": "AE",
							"display": "Adverse Event",
							"definition": "Adverse Event"
					}
			]
		}
		
2. adverse-event-type
	URL : 
	a. get all data
		Method : GET 
		Url format : host:port/{apikey}/adverse-event-type
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/adverse-event-type

	b. get by id
		Method : GET
		Url format : host:port/{apikey}/adverse-event-type/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/adverse-event-type/130
	
	c. Get data by code
		Method : GET
		Url format : host:port/{apikey}/adverse-event-type/code/{code}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/adverse-event-type/code/109006
		
	d. Add 
		Method : POST
		Url format : host:port/{apikey}/adverse-event-type
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/adverse-event-type
		body : 
			{
				"code" : "122003",
				"display" : "Choroidal hemorrhage",
				"definition" : ""
			}
			
		response : 
		{
				"err_code": 0,
				"err_msg": "Adverse Event Type has been add.",
				"data": [
						{
								"id": "110",
								"code": "122003",
								"display": "Choroidal hemorrhage",
								"definition": "null"
						}
				]
		}
		
		Keterangan :
			Data yang harus ditambahkan pada API ini dapat dilihat pada link ini https://www.hl7.org/fhir/valueset-adverse-event-type.html
			
	e. put
		Method : PUT
		Url format : host:port/{apikey}/adverse-event-type/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/adverse-event-type/100
		body:
		{
				"code": "109006",
				"display": "Anxiety disorder of childhood OR adolescence",
				"definition": "Anxiety disorder of childhood OR adolescence"
			}
		response : 
		{
				"err_code": 0,
				"err_msg": "Adverse Event Type has been update.",
				"data": [
						{
								"id": "100",
								"code": "109006",
								"display": "Anxiety disorder of childhood OR adolescence",
								"definition": "Anxiety disorder of childhood OR adolescence"
						}
				]
		}

3. adverse-event-seriousness
	a. get all data
		Method : GET 
		Url format : host:port/{apikey}/adverse-event-seriousness
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/adverse-event-seriousness

	b. get by id
		Method : GET
		Url format : host:port/{apikey}/adverse-event-seriousness/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/adverse-event-seriousness/130
	
	c. Get data by code
		Method : GET
		Url format : host:port/{apikey}/adverse-event-seriousness/code/{code}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/adverse-event-seriousness/code/Mild
		
	d. Add 
		Method : POST
		Url format : host:port/{apikey}/adverse-event-seriousness
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/adverse-event-seriousness
		body : 
			{
				"code" : "Mild",
				"display" : "Mild",
				"definition" : ""
			}
			
		response : 
		{
				"err_code": 0,
				"err_msg": "Adverse Event Seriousness has been add.",
				"data": [
						{
								"id": "100",
								"code": "Mild",
								"display": "Mild",
								"definition": "null"
						}
				]
		}
		
		Keterangan :
			Data yang harus ditambahkan pada API ini dapat dilihat pada link ini https://www.hl7.org/fhir/valueset-adverse-event-seriousness.html
		
	e. put
		Method : PUT
		Url format : host:port/{apikey}/adverse-event-seriousness/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/adverse-event-seriousness/100
		body:
		{
				"code" : "Mild",
				"display" : "Mild",
				"definition" : ""
			}
		response : 
		{
				"err_code": 0,
				"err_msg": "Adverse Event Seriousness has been update.",
				"data": [
						{
								"id": "100",
								"code": "Mild",
								"display": "Mild",
								"definition": "Mild"
						}
				]
		}
		
4. adverse-event-outcome
	a. get all data
		Method : GET 
		Url format : host:port/{apikey}/adverse-event-outcome
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/adverse-event-outcome

	b. get by id
		Method : GET
		Url format : host:port/{apikey}/adverse-event-outcome/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/adverse-event-outcome/130
	
	c. Get data by code
		Method : GET
		Url format : host:port/{apikey}/adverse-event-outcome/code/{code}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/adverse-event-outcome/code/resolved
		
	d. Add 
		Method : POST
		Url format : host:port/{apikey}/adverse-event-outcome
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/adverse-event-outcome
		body : 
			{
				"code" : "resolved",
				"display" : "Resolved",
				"definition" : ""
			}
			
		response : 
		{
				"err_code": 0,
				"err_msg": "Adverse Event Outcome has been add.",
				"data": [
						{
								"id": "100",
								"code": "resolved",
								"display": "Resolved",
								"definition": "null"
						}
				]
		}
		
		Keterangan :
			Data yang harus ditambahkan pada API ini dapat dilihat pada link ini https://www.hl7.org/fhir/valueset-adverse-event-outcome.html
			
	e. put
		Method : PUT
		Url format : host:port/{apikey}/adverse-event-outcome/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/adverse-event-outcome/100
		body:
			{
				"display" : "Resolved",
				"definition" : "Resolved"
			}
		response : 
		{
				"err_code": 0,
				"err_msg": "Adverse Event Outcome has been update.",
				"data": [
						{
								"id": "100",
								"code": "resolved",
								"display": "Resolved",
								"definition": "Resolved"
						}
				]
		}
		
5. adverse-event-causality
	a. get all data
		Method : GET 
		Url format : host:port/{apikey}/adverse-event-causality
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/adverse-event-causality

	b. get by id
		Method : GET
		Url format : host:port/{apikey}/adverse-event-causality/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/adverse-event-causality/130
	
	c. Get data by code
		Method : GET
		Url format : host:port/{apikey}/adverse-event-causality/code/{code}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/adverse-event-causality/code/causality1
		
	d. Add 
		Method : POST
		Url format : host:port/{apikey}/adverse-event-causality
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/adverse-event-causality
		body : 
			{
				"code" : "causality1",
				"display" : "causality1 placeholder",
				"definition" : ""
			}
			
		response : 
		{
				"err_code": 0,
				"err_msg": "Adverse Event Causality has been add.",
				"data": [
						{
								"id": "100",
								"code": "causality1",
								"display": "causality1 placeholder",
								"definition": "null"
						}
				]
		}
		
		Keterangan :
			Data yang harus ditambahkan pada API ini dapat dilihat pada link ini https://www.hl7.org/fhir/valueset-adverse-event-causality.html
			
		
	e. put
		Method : PUT
		Url format : host:port/{apikey}/adverse-event-causality/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/adverse-event-causality/100
		body:
			{
				"display" : "causality1 placeholder",
				"definition" : "causality1 placeholder"
			}
		response : 
		{
				"err_code": 0,
				"err_msg": "Adverse Event Causality has been update.",
				"data": [
						{
								"id": "100",
								"code": "causality1",
								"display": "causality1 placeholder",
								"definition": "causality1 placeholder"
						}
				]
		}
		
6. adverse-event-causality-assess
	a. get all data
		Method : GET 
		Url format : host:port/{apikey}/adverse-event-causality-assess
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/adverse-event-causality-assess

	b. get by id
		Method : GET
		Url format : host:port/{apikey}/adverse-event-causality-assess/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/adverse-event-causality-assess/130
	
	c. Get data by code
		Method : GET
		Url format : host:port/{apikey}/adverse-event-causality-assess/code/{code}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/adverse-event-causality-assess/code/assess1
		
	d. Add 
		Method : POST
		Url format : host:port/{apikey}/adverse-event-causality-assess
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/adverse-event-causality-assess
		body : 
			{
				"code" : "assess1",
				"display" : "assess1 placeholder",
				"definition" : ""
			}
			
		response : 
		{
				"err_code": 0,
				"err_msg": "Adverse Event Causality Assess has been add.",
				"data": [
						{
								"id": "100",
								"code": "assess1",
								"display": "assess1 placeholder",
								"definition": "null"
						}
				]
		}
		
		Keterangan :
			Data yang harus ditambahkan pada API ini dapat dilihat pada link ini https://www.hl7.org/fhir/valueset-adverse-event-causality-assess.html
			
	e. put
		Method : PUT
		Url format : host:port/{apikey}/adverse-event-causality-assess/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/adverse-event-causality-assess/100
		body:
			{
				"display" : "assess1 placeholder",
				"definition" : "assess1 placeholder"
			}
		response : 
		{
				"err_code": 0,
				"err_msg": "Adverse Event Causality Assess has been update.",
				"data": [
						{
								"id": "100",
								"code": "assess1",
								"display": "assess1 placeholder",
								"definition": "assess1 placeholder"
						}
				]
		}
		
7. adverse-event-causality-method
	a. get all data
		Method : GET 
		Url format : host:port/{apikey}/adverse-event-causality-method
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/adverse-event-causality-method

	b. get by id
		Method : GET
		Url format : host:port/{apikey}/adverse-event-causality-method/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/adverse-event-causality-method/130
	
	c. Get data by code
		Method : GET
		Url format : host:port/{apikey}/adverse-event-causality-method/code/{code}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/adverse-event-causality-method/code/method1
		
	d. Add 
		Method : POST
		Url format : host:port/{apikey}/adverse-event-causality-method
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/adverse-event-causality-method
		body : 
			{
				"code" : "method1",
				"display" : "placeholder",
				"definition" : ""
			}
			
		response : 
		{
				"err_code": 0,
				"err_msg": "Adverse Event Causality Method has been add.",
				"data": [
						{
								"id": "100",
								"code": "method1",
								"display": "placeholder",
								"definition": "null"
						}
				]
		}
		
		Keterangan :
			Data yang harus ditambahkan pada API ini dapat dilihat pada link ini https://www.hl7.org/fhir/valueset-adverse-event-causality-method.html
		
	e. put
		Method : PUT
		Url format : host:port/{apikey}/adverse-event-causality-method/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/adverse-event-causality-method/100
		body:
			{
				"display" : "placeholder",
				"definition" : "placeholder"
			}
		response : 
		{
				"err_code": 0,
				"err_msg": "Adverse Event Causality Method has been update.",
				"data": [
						{
								"id": "100",
								"code": "method1",
								"display": "placeholder",
								"definition": "placeholder"
						}
				]
		}
		
8. adverse-event-causality-result
	a. get all data
		Method : GET 
		Url format : host:port/{apikey}/adverse-event-causality-result
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/adverse-event-causality-result

	b. get by id
		Method : GET
		Url format : host:port/{apikey}/adverse-event-causality-result/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/adverse-event-causality-result/130
	
	c. Get data by code
		Method : GET
		Url format : host:port/{apikey}/adverse-event-causality-result/code/{code}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/adverse-event-causality-result/code/result2
		
	d. Add 
		Method : POST
		Url format : host:port/{apikey}/adverse-event-causality-result
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/adverse-event-causality-result
		body : 
			{
				"code" : "result2",
				"display" : "placeholder",
				"definition" : ""
			}
			
		response : 
		{
				"err_code": 0,
				"err_msg": "Adverse Event Causality Result has been add.",
				"data": [
						{
								"id": "101",
								"code": "result2",
								"display": "placeholder",
								"definition": "null"
						}
				]
		}
		
		Keterangan :
			Data yang harus ditambahkan pada API ini dapat dilihat pada link ini https://www.hl7.org/fhir/valueset-adverse-event-causality-result.html
		
	e. put
		Method : PUT
		Url format : host:port/{apikey}/adverse-event-causality-result/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/adverse-event-causality-result/100
		body:
			{
				"display" : "placeholder",
				"definition" : "placeholder"
			}
		response : 
		{
				"err_code": 0,
				"err_msg": "Adverse Event Causality Result has been update.",
				"data": [
						{
								"id": "100",
								"code": "result1",
								"display": "placeholder",
								"definition": "placeholder"
						}
				]
		}
		
9. allergy-clinical-status
	a. get all data
		Method : GET 
		Url format : host:port/{apikey}/allergy-clinical-status
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/allergy-clinical-status

	b. get by id
		Method : GET
		Url format : host:port/{apikey}/allergy-clinical-status/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/allergy-clinical-status/130
	
	c. Get data by code
		Method : GET
		Url format : host:port/{apikey}/allergy-clinical-status/code/{code}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/allergy-clinical-status/code/active
		
	d. Add 
		Method : POST
		Url format : host:port/{apikey}/allergy-clinical-status
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/allergy-clinical-status
		body : 
			{
				"code" : "active",
				"display" : "Active",
				"definition" : "An active record of a risk of a reaction to the identified substance."
			}
			
		response : 
		{
				"err_code": 0,
				"err_msg": "Allergy Clinical Status has been add.",
				"data": [
						{
								"id": "100",
								"code": "active",
								"display": "Active",
								"definition": "An active record of a risk of a reaction to the identified substance."
						}
				]
		}
		
		Keterangan :
			Data yang harus ditambahkan pada API ini dapat dilihat pada link ini https://www.hl7.org/fhir/valueset-allergy-clinical-status.html
		
	e. put
		Method : PUT
		Url format : host:port/{apikey}/allergy-clinical-status/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/allergy-clinical-status/100
		body:
			{
				"code" : "active",
				"display" : "Active",
				"definition" : "An active record of a risk of a reaction to the identified substance."
			}
		response : 
		{
				"err_code": 0,
				"err_msg": "Allergy Clinical Status has been update.",
				"data": [
						{
								"id": "100",
								"code": "active",
								"display": "Active",
								"definition": "An active record of a risk of a reaction to the identified substance"
						}
				]
		}	
		
10. allergy-verification-status
	a. get all data
		Method : GET 
		Url format : host:port/{apikey}/allergy-verification-status
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/allergy-verification-status

	b. get by id
		Method : GET
		Url format : host:port/{apikey}/allergy-verification-status/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/allergy-verification-status/130
	
	c. Get data by code
		Method : GET
		Url format : host:port/{apikey}/allergy-verification-status/code/{code}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/allergy-verification-status/code/unconfirmed
		
	d. Add 
		Method : POST
		Url format : host:port/{apikey}/allergy-verification-status
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/allergy-verification-status
		body : 
			{
				"code" : "unconfirmed",
				"display" : "Unconfirmed",
				"definition" : "A low level of certainty about the propensity for a reaction to the identified substance."
			}
			
		response : 
		{
				"err_code": 0,
				"err_msg": "Allergy Verification Status has been add.",
				"data": [
						{
								"id": "100",
								"code": "unconfirmed",
								"display": "Unconfirmed",
								"definition": "A low level of certainty about the propensity for a reaction to the identified substance."
						}
				]
		}
		
		Keterangan :
			Data yang harus ditambahkan pada API ini dapat dilihat pada link ini https://www.hl7.org/fhir/valueset-allergy-verification-status.html
		
	e. put
		Method : PUT
		Url format : host:port/{apikey}/allergy-verification-status/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/allergy-verification-status/100
		body:
			{
				"code" : "unconfirmed",
				"display" : "Unconfirmed",
				"definition" : "A low level of certainty about the propensity for a reaction to the identified substance."
			}
		response : 
		{
				"err_code": 0,
				"err_msg": "Allergy Verification Status has been update.",
				"data": [
						{
								"id": "100",
								"code": "unconfirmed",
								"display": "Unconfirmed",
								"definition": "A low level of certainty about the propensity for a reaction to the identified substance"
						}
				]
		}
		
11. allergy-intolerance-type
	a. get all data
		Method : GET 
		Url format : host:port/{apikey}/allergy-intolerance-type
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/allergy-intolerance-type

	b. get by id
		Method : GET
		Url format : host:port/{apikey}/allergy-intolerance-type/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/allergy-intolerance-type/130
	
	c. Get data by code
		Method : GET
		Url format : host:port/{apikey}/allergy-intolerance-type/code/{code}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/allergy-intolerance-type/code/allergy
		
	d. Add 
		Method : POST
		Url format : host:port/{apikey}/allergy-intolerance-type
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/allergy-intolerance-type
		body : 
			{
				"code" : "allergy",
				"display" : "Allergy",
				"definition" : "A propensity for hypersensitivity reaction(s) to a substance. These reactions are most typically type I hypersensitivity, plus other allergy-like reactions, including pseudoallergy."
			}
			
		response : 
		{
				"err_code": 0,
				"err_msg": "Allergy Intolerance Type has been add.",
				"data": [
						{
								"id": "100",
								"code": "allergy",
								"display": "Allergy",
								"definition": "A propensity for hypersensitivity reaction(s) to a substance. These reactions are most typically type I hypersensitivity, plus other allergylike reactions, including pseudoallergy."
						}
				]
		}
		
		Keterangan :
			Data yang harus ditambahkan pada API ini dapat dilihat pada link ini https://www.hl7.org/fhir/valueset-allergy-intolerance-type.html
		
	e. put
		Method : PUT
		Url format : host:port/{apikey}/allergy-intolerance-type/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/allergy-intolerance-type/100
		body:
			{
				"code" : "allergy",
				"display" : "Allergy",
				"definition" : "A propensity for hypersensitivity reaction(s) to a substance. These reactions are most typically type I hypersensitivity, plus other allergy-like reactions, including pseudoallergy."
			}
		response : 
		{
				"err_code": 0,
				"err_msg": "Allergy Intolerance Type has been update.",
				"data": [
						{
								"id": "100",
								"code": "allergy",
								"display": "Allergy",
								"definition": "A propensity for hypersensitivity reactions to a substance These reactions are most typically type I hypersensitivity, plus other allergylike reactions, including pseudoallergy"
						}
				]
		}

12. allergy-intolerance-category
	a. get all data
		Method : GET 
		Url format : host:port/{apikey}/allergy-intolerance-category
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/allergy-intolerance-category

	b. get by id
		Method : GET
		Url format : host:port/{apikey}/allergy-intolerance-category/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/allergy-intolerance-category/130
	
	c. Get data by code
		Method : GET
		Url format : host:port/{apikey}/allergy-intolerance-category/code/{code}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/allergy-intolerance-category/code/food
		
	d. Add 
		Method : POST
		Url format : host:port/{apikey}/allergy-intolerance-category
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/allergy-intolerance-category
		body : 
			{
				"code" : "food",
				"display" : "Food",
				"definition" : "Any substance consumed to provide nutritional support for the body"
			}
			
		response : 
		{
				"err_code": 0,
				"err_msg": "Allergy Intolerance Category has been add.",
				"data": [
						{
								"id": "100",
								"code": "food",
								"display": "Food",
								"definition": "Any substance consumed to provide nutritional support for the body"
						}
				]
		}
		
		Keterangan :
			Data yang harus ditambahkan pada API ini dapat dilihat pada link ini https://www.hl7.org/fhir/valueset-allergy-intolerance-category.html
		
	e. put
		Method : PUT
		Url format : host:port/{apikey}/allergy-intolerance-category/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/allergy-intolerance-category/100
		body:
			{
				"code" : "food",
				"display" : "Food",
				"definition" : "Any substance consumed to provide nutritional support for the body"
			}
		response : 
		{
				"err_code": 0,
				"err_msg": "Allergy Intolerance Category has been update.",
				"data": [
						{
								"id": "100",
								"code": "food",
								"display": "Food",
								"definition": "Any substance consumed to provide nutritional support for the body"
						}
				]
		}

13. allergy-intolerance-criticality
	a. get all data
		Method : GET 
		Url format : host:port/{apikey}/allergy-intolerance-criticality
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/allergy-intolerance-criticality

	b. get by id
		Method : GET
		Url format : host:port/{apikey}/allergy-intolerance-criticality/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/allergy-intolerance-criticality/130
	
	c. Get data by code
		Method : GET
		Url format : host:port/{apikey}/allergy-intolerance-criticality/code/{code}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/allergy-intolerance-criticality/code/low
		
	d. Add 
		Method : POST
		Url format : host:port/{apikey}/allergy-intolerance-criticality
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/allergy-intolerance-criticality
		body : 
			{
				"code" : "low",
				"display" : "Low Risk",
				"definition" : "Worst case result of a future exposure is not assessed to be life-threatening or having high potential for organ system failure."
			}
			
		response : 
		{
				"err_code": 0,
				"err_msg": "Allergy Intolerance Criticality has been add.",
				"data": [
						{
								"id": "100",
								"code": "low",
								"display": "Low Risk",
								"definition": "Worst case result of a future exposure is not assessed to be lifethreatening or having high potential for organ system failure."
						}
				]
		}
		
		Keterangan :
			Data yang harus ditambahkan pada API ini dapat dilihat pada link ini https://www.hl7.org/fhir/valueset-allergy-intolerance-criticality.html
		
	e. put
		Method : PUT
		Url format : host:port/{apikey}/allergy-intolerance-criticality/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/allergy-intolerance-criticality/100
		body:
			{
				"code" : "low",
				"display" : "Low Risk",
				"definition" : "Worst case result of a future exposure is not assessed to be life-threatening or having high potential for organ system failure."
			}
		response : 
		{
				"err_code": 0,
				"err_msg": "Allergy Intolerance Criticality has been update.",
				"data": [
						{
								"id": "100",
								"code": "low",
								"display": "Low Risk",
								"definition": "Worst case result of a future exposure is not assessed to be lifethreatening or having high potential for organ system failure"
						}
				]
		}
		
14. allergy-intolerance-code
	a. get all data
		Method : GET 
		Url format : host:port/{apikey}/allergy-intolerance-code
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/allergy-intolerance-code

	b. get by id
		Method : GET
		Url format : host:port/{apikey}/allergy-intolerance-code/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/allergy-intolerance-code/130
	
	c. Get data by code
		Method : GET
		Url format : host:port/{apikey}/allergy-intolerance-code/code/{code}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/allergy-intolerance-code/code/102002
		
	d. Add 
		Method : POST
		Url format : host:port/{apikey}/allergy-intolerance-code
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/allergy-intolerance-code
		body : 
			{
				"code" : "102002",
				"display" : "Hemoglobin Okaloosa",
				"definition" : ""
			}
			
		response : 
		{
				"err_code": 0,
				"err_msg": "Allergy Intolerance Code has been add.",
				"data": [
						{
								"id": "100",
								"code": "102002",
								"display": "Hemoglobin Okaloosa",
								"definition": "null"
						}
				]
		}
		
		Keterangan :
			Data yang harus ditambahkan pada API ini dapat dilihat pada link ini https://www.hl7.org/fhir/valueset-allergyintolerance-code.html
		
	e. put
		Method : PUT
		Url format : host:port/{apikey}/allergy-intolerance-code/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/allergy-intolerance-code/100
		body:
			{
				"code" : "102002",
				"display" : "Hemoglobin Okaloosa",
				"definition" : ""
			}
		response : 
		{
				"err_code": 0,
				"err_msg": "Allergy Intolerance Code has been update.",
				"data": [
						{
								"id": "100",
								"code": "102002",
								"display": "Hemoglobin Okaloosa",
								"definition": "null"
						}
				]
		}
		
15. substance-code
	a. get all data
		Method : GET 
		Url format : host:port/{apikey}/substance-code
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/substance-code

	b. get by id
		Method : GET
		Url format : host:port/{apikey}/substance-code/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/substance-code/130
	
	c. Get data by code
		Method : GET
		Url format : host:port/{apikey}/substance-code/code/{code}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/substance-code/code/102002
		
	d. Add 
		Method : POST
		Url format : host:port/{apikey}/substance-code
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/substance-code
		body : 
			{
				"code" : "102002",
				"display" : "Hemoglobin Okaloosa",
				"definition" : ""
			}
			
		response : 
		{
				"err_code": 0,
				"err_msg": "Substance Code has been add.",
				"data": [
						{
								"id": "100",
								"code": "102002",
								"display": "Hemoglobin Okaloosa",
								"definition": "null"
						}
				]
		}
		
		Keterangan :
			Data yang harus ditambahkan pada API ini dapat dilihat pada link ini https://www.hl7.org/fhir/valueset-substance-code.html
		
	e. put
		Method : PUT
		Url format : host:port/{apikey}/substance-code/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/substance-code/100
		body:
			{
				"code" : "102002",
				"display" : "Hemoglobin Okaloosa",
				"definition" : ""
			}
		response : 
		{
				"err_code": 0,
				"err_msg": "Substance Code has been update.",
				"data": [
						{
								"id": "100",
								"code": "102002",
								"display": "Hemoglobin Okaloosa",
								"definition": "null"
						}
				]
		}	
		
16. clinical-findings
	a. get all data
		Method : GET 
		Url format : host:port/{apikey}/clinical-findings
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/clinical-findings

	b. get by id
		Method : GET
		Url format : host:port/{apikey}/clinical-findings/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/clinical-findings/130
	
	c. Get data by code
		Method : GET
		Url format : host:port/{apikey}/clinical-findings/code/{code}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/clinical-findings/code/109006
		
	d. Add 
		Method : POST
		Url format : host:port/{apikey}/clinical-findings
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/clinical-findings
		body : 
			{
				"code" : "109006",
				"display" : "Anxiety disorder of childhood OR adolescence",
				"definition" : ""
			}
			
		response : 
		{
				"err_code": 0,
				"err_msg": "Clinical Findings has been add.",
				"data": [
						{
								"id": "100",
								"code": "109006",
								"display": "Anxiety disorder of childhood OR adolescence",
								"definition": "null"
						}
				]
		}
		
		Keterangan :
			Data yang harus ditambahkan pada API ini dapat dilihat pada link ini https://www.hl7.org/fhir/valueset-clinical-findings.html
		
	e. put
		Method : PUT
		Url format : host:port/{apikey}/clinical-findings/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/clinical-findings/100
		body:
			{
				"code" : "109006",
				"display" : "Anxiety disorder of childhood OR adolescence",
				"definition" : ""
			}
		response : 
		{
				"err_code": 0,
				"err_msg": "Clinical Findings has been update.",
				"data": [
						{
								"id": "100",
								"code": "109006",
								"display": "Anxiety disorder of childhood OR adolescence",
								"definition": "null"
						}
				]
		}
		
17. reaction-event-severity
	a. get all data
		Method : GET 
		Url format : host:port/{apikey}/reaction-event-severity
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/reaction-event-severity

	b. get by id
		Method : GET
		Url format : host:port/{apikey}/reaction-event-severity/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/reaction-event-severity/130
	
	c. Get data by code
		Method : GET
		Url format : host:port/{apikey}/reaction-event-severity/code/{code}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/reaction-event-severity/code/mild
		
	d. Add 
		Method : POST
		Url format : host:port/{apikey}/reaction-event-severity
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/reaction-event-severity
		body : 
			{
				"code" : "mild",
				"display" : "Mild",
				"definition" : "Causes mild physiological effects"
			}
			
		response : 
		{
				"err_code": 0,
				"err_msg": "Reaction Event Severity has been add.",
				"data": [
						{
								"id": "100",
								"code": "mild",
								"display": "Mild",
								"definition": "Causes mild physiological effects"
						}
				]
		}
		
		Keterangan :
			Data yang harus ditambahkan pada API ini dapat dilihat pada link ini https://www.hl7.org/fhir/valueset-reaction-event-severity.html
		
	e. put
		Method : PUT
		Url format : host:port/{apikey}/reaction-event-severity/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/reaction-event-severity/100
		body:
			{
				"code" : "mild",
				"display" : "Mild",
				"definition" : "Causes mild physiological effects"
			}
		response : 
		{
				"err_code": 0,
				"err_msg": "Reaction Event Severity has been update.",
				"data": [
						{
								"id": "100",
								"code": "mild",
								"display": "Mild",
								"definition": "Causes mild physiological effects"
						}
				]
		}
		
18. route-codes
	a. get all data
		Method : GET 
		Url format : host:port/{apikey}/route-codes
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/route-codes

	b. get by id
		Method : GET
		Url format : host:port/{apikey}/route-codes/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/route-codes/130
	
	c. Get data by code
		Method : GET
		Url format : host:port/{apikey}/route-codes/code/{code}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/route-codes/code/6064005
		
	d. Add 
		Method : POST
		Url format : host:port/{apikey}/route-codes
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/route-codes
		body : 
			{
				"code" : "6064005",
				"display" : "Topical route",
				"definition" : ""
			}
			
		response : 
		{
				"err_code": 0,
				"err_msg": "Route Codes has been add.",
				"data": [
						{
								"id": "100",
								"code": "6064005",
								"display": "Topical route",
								"definition": "null"
						}
				]
		}
		
		Keterangan :
			Data yang harus ditambahkan pada API ini dapat dilihat pada link ini https://www.hl7.org/fhir/valueset-route-codes.html
		
	e. put
		Method : PUT
		Url format : host:port/{apikey}/route-codes/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/route-codes/100
		body:
			{
				"code" : "6064005",
				"display" : "Topical route",
				"definition" : ""
			}
		response : 
		{
				"err_code": 0,
				"err_msg": "Route Codes has been update.",
				"data": [
						{
								"id": "100",
								"code": "6064005",
								"display": "Topical route",
								"definition": "null"
						}
				]
		}
		
19. care-plan-status
	a. get all data
		Method : GET 
		Url format : host:port/{apikey}/care-plan-status
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/care-plan-status

	b. get by id
		Method : GET
		Url format : host:port/{apikey}/care-plan-status/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/care-plan-status/130
	
	c. Get data by code
		Method : GET
		Url format : host:port/{apikey}/care-plan-status/code/{code}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/care-plan-status/code/draft
		
	d. Add 
		Method : POST
		Url format : host:port/{apikey}/care-plan-status
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/care-plan-status
		body : 
			{
				"code" : "draft",
				"display" : "Pending",
				"definition" : "The plan is in development or awaiting use but is not yet intended to be acted upon."
			}
			
		response : 
		{
				"err_code": 0,
				"err_msg": "Care Plan Status has been add.",
				"data": [
						{
								"id": "100",
								"code": "draft",
								"display": "Pending",
								"definition": "The plan is in development or awaiting use but is not yet intended to be acted upon."
						}
				]
		}
		
		Keterangan :
			Data yang harus ditambahkan pada API ini dapat dilihat pada link ini https://www.hl7.org/fhir/valueset-care-plan-status.html
		
	e. put
		Method : PUT
		Url format : host:port/{apikey}/care-plan-status/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/care-plan-status/100
		body:
			{
				"code" : "draft",
				"display" : "Pending",
				"definition" : "The plan is in development or awaiting use but is not yet intended to be acted upon."
			}
		response : 
		{
				"err_code": 0,
				"err_msg": "Care Plan Status has been update.",
				"data": [
						{
								"id": "100",
								"code": "draft",
								"display": "Pending",
								"definition": "The plan is in development or awaiting use but is not yet intended to be acted upon"
						}
				]
		}	
		
20. care-plan-intent
	a. get all data
		Method : GET 
		Url format : host:port/{apikey}/care-plan-intent
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/care-plan-intent

	b. get by id
		Method : GET
		Url format : host:port/{apikey}/care-plan-intent/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/care-plan-intent/130
	
	c. Get data by code
		Method : GET
		Url format : host:port/{apikey}/care-plan-intent/code/{code}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/care-plan-intent/code/proposal
		
	d. Add 
		Method : POST
		Url format : host:port/{apikey}/care-plan-intent
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/care-plan-intent
		body : 
			{
				"code" : "proposal",
				"display" : "Proposal",
				"definition" : "The care plan is a suggestion made by someone/something that doesn't have an intention to ensure it occurs and without providing an authorization to act."
			}
			
		response : 
		{
				"err_code": 0,
				"err_msg": "Care Plan Intent has been add.",
				"data": [
						{
								"id": "101",
								"code": "proposal",
								"display": "Proposal",
								"definition": "The care plan is a suggestion made by someone/something that doesnt have an intention to ensure it occurs and without providing an authorization to act."
						}
				]
		}
		
		Keterangan :
			Data yang harus ditambahkan pada API ini dapat dilihat pada link ini https://www.hl7.org/fhir/valueset-care-plan-intent.html

			
	e. put
		Method : PUT
		Url format : host:port/{apikey}/care-plan-intent/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/care-plan-intent/100
		body:
			{
				"code" : "proposal",
				"display" : "Proposal",
				"definition" : "The care plan is a suggestion made by someone/something that doesn't have an intention to ensure it occurs and without providing an authorization to act."
			}
		response : 
		{
				"err_code": 0,
				"err_msg": "Care Plan Intent has been update.",
				"data": [
						{
								"id": "101",
								"code": "proposal",
								"display": "Proposal",
								"definition": "The care plan is a suggestion made by someonesomething that doesnt have an intention to ensure it occurs and without providing an authorization to act"
						}
				]
		}
		
21. care-plan-category
	a. get all data
		Method : GET 
		Url format : host:port/{apikey}/care-plan-category
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/care-plan-category

	b. get by id
		Method : GET
		Url format : host:port/{apikey}/care-plan-category/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/care-plan-category/130
	
	c. Get data by code
		Method : GET
		Url format : host:port/{apikey}/care-plan-category/code/{code}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/care-plan-category/code/288832002
		
	d. Add 
		Method : POST
		Url format : host:port/{apikey}/care-plan-category
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/care-plan-category
		body : 
			{
				"code" : "288832002",
				"display" : "CPA care plan",
				"definition" : ""
			}
			
		response : 
		{
				"err_code": 0,
				"err_msg": "Care Plan Category has been add.",
				"data": [
						{
								"id": "100",
								"code": "288832002",
								"display": "CPA care plan",
								"definition": "null"
						}
				]
		}
		
		Keterangan :
			Data yang harus ditambahkan pada API ini dapat dilihat pada link ini https://www.hl7.org/fhir/valueset-care-plan-category.html
		
	e. put
		Method : PUT
		Url format : host:port/{apikey}/care-plan-category/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/care-plan-category/100
		body:
			{
				"code" : "288832002",
				"display" : "CPA care plan",
				"definition" : ""
			}
		response : 
		{
				"err_code": 0,
				"err_msg": "Care Plan Category has been update.",
				"data": [
						{
								"id": "100",
								"code": "288832002",
								"display": "CPA care plan",
								"definition": "null"
						}
				]
		}

22. care-plan-activity-outcome
	a. get all data
		Method : GET 
		Url format : host:port/{apikey}/care-plan-activity-outcome
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/care-plan-activity-outcome

	b. get by id
		Method : GET
		Url format : host:port/{apikey}/care-plan-activity-outcome/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/care-plan-activity-outcome/130
	
	c. Get data by code
		Method : GET
		Url format : host:port/{apikey}/care-plan-activity-outcome/code/{code}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/care-plan-activity-outcome/code/54777007
		
	d. Add 
		Method : POST
		Url format : host:port/{apikey}/care-plan-activity-outcome
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/care-plan-activity-outcome
		body : 
			{
				"code" : "54777007",
				"display" : "Deficient knowledge",
				"definition" : ""
			}
			
		response : 
		{
				"err_code": 0,
				"err_msg": "Care Plan Activity Outcome has been add.",
				"data": [
						{
								"id": "100",
								"code": "54777007",
								"display": "Deficient knowledge",
								"definition": "null"
						}
				]
		}
		
		Keterangan :
			Data yang harus ditambahkan pada API ini dapat dilihat pada link ini https://www.hl7.org/fhir/valueset-care-plan-activity-outcome.html

		
	e. put
		Method : PUT
		Url format : host:port/{apikey}/care-plan-activity-outcome/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/care-plan-activity-outcome/100
		body:
			{
				"code" : "54777007",
				"display" : "Deficient knowledge",
				"definition" : ""
			}
		response : 
		{
				"err_code": 0,
				"err_msg": "Care Plan Activity Outcome has been update.",
				"data": [
						{
								"id": "100",
								"code": "54777007",
								"display": "Deficient knowledge",
								"definition": "null"
						}
				]
		}
		
23. care-plan-activity-category
	a. get all data
		Method : GET 
		Url format : host:port/{apikey}/care-plan-activity-category
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/care-plan-activity-category

	b. get by id
		Method : GET
		Url format : host:port/{apikey}/care-plan-activity-category/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/care-plan-activity-category/130
	
	c. Get data by code
		Method : GET
		Url format : host:port/{apikey}/care-plan-activity-category/code/{code}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/care-plan-activity-category/code/diet
		
	d. Add 
		Method : POST
		Url format : host:port/{apikey}/care-plan-activity-category
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/care-plan-activity-category
		body : 
			{
				"code" : "diet",
				"display" : "Diet",
				"definition" : "Plan for the patient to consume food of a specified nature"
			}
			
		response : 
		{
				"err_code": 0,
				"err_msg": "Care Plan Activity Category has been add.",
				"data": [
						{
								"id": "100",
								"code": "diet",
								"display": "Diet",
								"definition": "Plan for the patient to consume food of a specified nature"
						}
				]
		}
		
		Keterangan :
			Data yang harus ditambahkan pada API ini dapat dilihat pada link ini https://www.hl7.org/fhir/valueset-care-plan-activity-category.html
			
	e. put
		Method : PUT
		Url format : host:port/{apikey}/care-plan-activity-category/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/care-plan-activity-category/100
		body:
			{
				"code" : "diet",
				"display" : "Diet",
				"definition" : "Plan for the patient to consume food of a specified nature"
			}
		response : 
		{
				"err_code": 0,
				"err_msg": "Care Plan Activity Category has been update.",
				"data": [
						{
								"id": "100",
								"code": "diet",
								"display": "Diet",
								"definition": "Plan for the patient to consume food of a specified nature"
						}
				]
		}	
		
24.  care-plan-activity
	a. get all data
		Method : GET 
		Url format : host:port/{apikey}/care-plan-activity
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/care-plan-activity

	b. get by id
		Method : GET
		Url format : host:port/{apikey}/care-plan-activity/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/care-plan-activity/130
	
	c. Get data by code
		Method : GET
		Url format : host:port/{apikey}/care-plan-activity/code/{code}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/care-plan-activity/code/104001
		
	d. Add 
		Method : POST
		Url format : host:port/{apikey}/care-plan-activity
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/care-plan-activity
		body : 
			{
				"code" : "104001",
				"display" : "Excision of lesion of patella",
				"definition" : ""
			}
			
		response : 
		{
				"err_code": 0,
				"err_msg": "Care Plan Activity has been add.",
				"data": [
						{
								"id": "100",
								"code": "104001",
								"display": "Excision of lesion of patella",
								"definition": "null"
						}
				]
		}
		
		Keterangan :
			Data yang harus ditambahkan pada API ini dapat dilihat pada link ini https://www.hl7.org/fhir/valueset-care-plan-activity.html

		
	e. put
		Method : PUT
		Url format : host:port/{apikey}/care-plan-activity/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/care-plan-activity/100
		body:
			{
				"code" : "104001",
				"display" : "Excision of lesion of patella",
				"definition" : ""
			}
		response : 
		{
				"err_code": 0,
				"err_msg": "Care Plan Activity has been update.",
				"data": [
						{
								"id": "100",
								"code": "104001",
								"display": "Excision of lesion of patella",
								"definition": "null"
						}
				]
		}			
		
25. activity-reason
	a. get all data
		Method : GET 
		Url format : host:port/{apikey}/activity-reason
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/activity-reason

	b. get by id
		Method : GET
		Url format : host:port/{apikey}/activity-reason/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/activity-reason/130
	
	c. Get data by code
		Method : GET
		Url format : host:port/{apikey}/activity-reason/code/{code}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/activity-reason/code/109006
		
	d. Add 
		Method : POST
		Url format : host:port/{apikey}/activity-reason
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/activity-reason
		body : 
			{
				"code" : "109006",
				"display" : "Anxiety disorder of childhood OR adolescence",
				"definition" : ""
			}
			
		response : 
		{
				"err_code": 0,
				"err_msg": "Activity Reason  has been add.",
				"data": [
						{
								"id": "100",
								"code": "109006",
								"display": "Anxiety disorder of childhood OR adolescence",
								"definition": "null"
						}
				]
		}
		
		Keterangan :
			Data yang harus ditambahkan pada API ini dapat dilihat pada link ini https://www.hl7.org/fhir/valueset-activity-reason.html

		
	e. put
		Method : PUT
		Url format : host:port/{apikey}/activity-reason/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/activity-reason/100
		body:
			{
				"code" : "109006",
				"display" : "Anxiety disorder of childhood OR adolescence",
				"definition" : ""
			}
		response : 
		{
				"err_code": 0,
				"err_msg": "Activity Reason has been update.",
				"data": [
						{
								"id": "100",
								"code": "109006",
								"display": "Anxiety disorder of childhood OR adolescence",
								"definition": "null"
						}
				]
		}

26. care-plan-activity-status
	a. get all data
		Method : GET 
		Url format : host:port/{apikey}/care-plan-activity-status
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/care-plan-activity-status

	b. get by id
		Method : GET
		Url format : host:port/{apikey}/care-plan-activity-status/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/care-plan-activity-status/130
	
	c. Get data by code
		Method : GET
		Url format : host:port/{apikey}/care-plan-activity-status/code/{code}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/care-plan-activity-status/code/not-started
		
	d. Add 
		Method : POST
		Url format : host:port/{apikey}/care-plan-activity-status
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/care-plan-activity-status
		body : 
			{
				"code" : "not-started",
				"display" : "Not Started",
				"definition" : "Activity is planned but no action has yet been taken."
			}
			
		response : 
		{
				"err_code": 0,
				"err_msg": "Care Plan Activity Status has been add.",
				"data": [
						{
								"id": "103",
								"code": "not-started",
								"display": "Not Started",
								"definition": "Activity is planned but no action has yet been taken."
						}
				]
		}
		
		Keterangan :
			Data yang harus ditambahkan pada API ini dapat dilihat pada link ini https://www.hl7.org/fhir/valueset-care-plan-activity-status.html
		
	e. put
		Method : PUT
		Url format : host:port/{apikey}/care-plan-activity-status/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/care-plan-activity-status/100
		body:
			{
				"code" : "not-started",
				"display" : "Not Started",
				"definition" : "Activity is planned but no action has yet been taken."
			}
		response : 
		{
				"err_code": 0,
				"err_msg": "Care Plan Activity Status has been update.",
				"data": [
						{
								"id": "103",
								"code": "not-started",
								"display": "Not Started",
								"definition": "Activity is planned but no action has yet been taken"
						}
				]
		}
		
27. medication-codes
	a. get all data
		Method : GET 
		Url format : host:port/{apikey}/medication-codes
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/medication-codes

	b. get by id
		Method : GET
		Url format : host:port/{apikey}/medication-codes/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/medication-codes/130
	
	c. Get data by code
		Method : GET
		Url format : host:port/{apikey}/medication-codes/code/{code}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/medication-codes/code/261000
		
	d. Add 
		Method : POST
		Url format : host:port/{apikey}/medication-codes
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/medication-codes
		body : 
			{
				"code" : "261000",
				"display" : "Codeine phosphate",
				"definition" : ""
			}
			
		response : 
		{
				"err_code": 0,
				"err_msg": "Medication Codes has been add.",
				"data": [
						{
								"id": "100",
								"code": "261000",
								"display": "Codeine phosphate",
								"definition": "null"
						}
				]
		}
		
		Keterangan :
			Data yang harus ditambahkan pada API ini dapat dilihat pada link ini https://www.hl7.org/fhir/valueset-medication-codes.html
		
	e. put
		Method : PUT
		Url format : host:port/{apikey}/medication-codes/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/medication-codes/100
		body:
			{
				"code" : "261000",
				"display" : "Codeine phosphate",
				"definition" : ""
			}
		response : 
		{
				"err_code": 0,
				"err_msg": "Medication Codes has been update.",
				"data": [
						{
								"id": "100",
								"code": "261000",
								"display": "Codeine phosphate",
								"definition": "null"
						}
				]
		}
		
28. care-team-status
	a. get all data
		Method : GET 
		Url format : host:port/{apikey}/care-team-status
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/care-team-status

	b. get by id
		Method : GET
		Url format : host:port/{apikey}/care-team-status/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/care-team-status/130
	
	c. Get data by code
		Method : GET
		Url format : host:port/{apikey}/care-team-status/code/{code}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/care-team-status/code/proposed
		
	d. Add 
		Method : POST
		Url format : host:port/{apikey}/care-team-status
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/care-team-status
		body : 
			{
				"code" : "proposed",
				"display" : "Proposed",
				"definition" : "The care team has been drafted and proposed, but not yet participating in the coordination and delivery of care."
			}
			
		response : 
		{
				"err_code": 0,
				"err_msg": "Care Team Status has been add.",
				"data": [
						{
								"id": "100",
								"code": "proposed",
								"display": "Proposed",
								"definition": "The care team has been drafted and proposed, but not yet participating in the coordination and delivery of care."
						}
				]
		}
		
		Keterangan :
			Data yang harus ditambahkan pada API ini dapat dilihat pada link ini https://www.hl7.org/fhir/valueset-care-team-status.html
		
	e. put
		Method : PUT
		Url format : host:port/{apikey}/care-team-status/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/care-team-status/100
		body:
			{
				"code" : "not-started",
				"display" : "Not Started",
				"definition" : "Activity is planned but no action has yet been taken."
			}
		response : 
		{
				"err_code": 0,
				"err_msg": "Care Team Status has been update.",
				"data": [
						{
								"id": "100",
								"code": "proposed",
								"display": "Proposed",
								"definition": "The care team has been drafted and proposed, but not yet participating in the coordination and delivery of care"
						}
				]
		}
		
29. care-team-category
	a. get all data
		Method : GET 
		Url format : host:port/{apikey}/care-team-category
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/care-team-category

	b. get by id
		Method : GET
		Url format : host:port/{apikey}/care-team-category/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/care-team-category/130
	
	c. Get data by code
		Method : GET
		Url format : host:port/{apikey}/care-team-category/code/{code}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/care-team-category/code/event
		
	d. Add 
		Method : POST
		Url format : host:port/{apikey}/care-team-category
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/care-team-category
		body : 
			{
				"code" : "event",
				"display" : "Event",
				"definition" : "This type of team focuses on one specific type of incident, which is non-patient specific. The incident is determined by the context of use. For example, code team (code red, code blue, medical emergency treatment) or the PICC line team."
			}
			
		response : 
		{
				"err_code": 0,
				"err_msg": "Care Team Category has been add.",
				"data": [
						{
								"id": "100",
								"code": "event",
								"display": "Event",
								"definition": "This type of team focuses on one specific type of incident, which is non-patient specific. The incident is determined by the context of use. For example, code team (code red, code blue, medical emergency treatment) or the PICC line team."
						}
				]
		}
		
		Keterangan :
			Data yang harus ditambahkan pada API ini dapat dilihat pada link ini https://www.hl7.org/fhir/valueset-care-team-category.html

		
	e. put
		Method : PUT
		Url format : host:port/{apikey}/care-team-category/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/care-team-category/100
		body:
			{
				"code" : "event",
				"display" : "Event",
				"definition" : "This type of team focuses on one specific type of incident, which is non-patient specific. The incident is determined by the context of use. For example, code team (code red, code blue, medical emergency treatment) or the PICC line team."
			}
		response : 
		{
				"err_code": 0,
				"err_msg": "Care Team Category has been update.",
				"data": [
						{
								"id": "100",
								"code": "event",
								"display": "Event",
								"definition": "This type of team focuses on one specific type of incident, which is nonpatient specific The incident is determined by the context of use For example, code team code red, code blue, medical emergency treatment or the PICC line team"
						}
				]
		}
		
30. participant-role
	a. get all data
		Method : GET 
		Url format : host:port/{apikey}/participant-role
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/participant-role
		
	b. get by id
		Method : GET
		Url format : host:port/{apikey}/participant-role/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/participant-role/130
	
	c. Get data by code
		Method : GET
		Url format : host:port/{apikey}/participant-role/code/{code}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/participant-role/code/270002
		
	d. Add 
		Method : POST
		Url format : host:port/{apikey}/participant-role
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/participant-role
		body : 
			{
				"code" : "270002",
				"display" : "Female first cousin",
				"definition" : ""
			}
			
		response : 
		{
				"err_code": 0,
				"err_msg": "Participant Role has been add.",
				"data": [
						{
								"id": "100",
								"code": "270002",
								"display": "Female first cousin",
								"definition": "null"
						}
				]
		}
		
		Keterangan :
			Data yang harus ditambahkan pada API ini dapat dilihat pada link ini https://www.hl7.org/fhir/valueset-participant-role.html

			
	e. put
		Method : PUT
		Url format : host:port/{apikey}/participant-role/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/participant-role/100
		body:
			{
				"code" : "270002",
				"display" : "Female first cousin",
				"definition" : ""
			}
		response : 
		{
				"err_code": 0,
				"err_msg": "Participant Role has been update.",
				"data": [
						{
								"id": "100",
								"code": "270002",
								"display": "Female first cousin",
								"definition": "null"
						}
				]
		}
		
31. clinical-impression-status
	a. get all data
		Method : GET 
		Url format : host:port/{apikey}/clinical-impression-status
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/clinical-impression-status
		
	b. get by id
		Method : GET
		Url format : host:port/{apikey}/clinical-impression-status/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/clinical-impression-status/130
	
	c. Get data by code
		Method : GET
		Url format : host:port/{apikey}/clinical-impression-status/code/{code}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/clinical-impression-status/code/draft
		
	d. Add 
		Method : POST
		Url format : host:port/{apikey}/clinical-impression-status
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/clinical-impression-status
		body : 
			{
				"code" : "draft",
				"display" : "In progress",
				"definition" : "The assessment is still on-going and results are not yet final."
			}
			
		response : 
		{
				"err_code": 0,
				"err_msg": "Clinical Impression Status has been add.",
				"data": [
						{
								"id": "100",
								"code": "draft",
								"display": "In progress",
								"definition": "The assessment is still on-going and results are not yet final."
						}
				]
		}
		
		Keterangan :
			Data yang harus ditambahkan pada API ini dapat dilihat pada link ini https://www.hl7.org/fhir/valueset-clinical-impression-status.html

		
	e. put
		Method : PUT
		Url format : host:port/{apikey}/clinical-impression-status/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/clinical-impression-status/100
		body:
			{
				"code" : "270002",
				"display" : "Female first cousin",
				"definition" : ""
			}
		response : 
		{
				"err_code": 0,
				"err_msg": "Clinical Impression Status has been update.",
				"data": [
						{
								"id": "100",
								"code": "draft",
								"display": "In progress",
								"definition": "The assessment is still ongoing and results are not yet final"
						}
				]
		}
		
32. investigation-sets
	a. get all data
		Method : GET 
		Url format : host:port/{apikey}/investigation-sets
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/investigation-sets
		
	b. get by id
		Method : GET
		Url format : host:port/{apikey}/investigation-sets/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/investigation-sets/130
	
	c. Get data by code
		Method : GET
		Url format : host:port/{apikey}/investigation-sets/code/{code}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/investigation-sets/code/271336007
		
	d. Add 
		Method : POST
		Url format : host:port/{apikey}/investigation-sets
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/investigation-sets
		body : 
			{
				"code" : "271336007",
				"display" : "Examination / signs"
			}
			
		response : 
		{
				"err_code": 0,
				"err_msg": "Investigation Sets has been add.",
				"data": [
						{
								"id": "100",
								"code": "271336007",
								"display": "Examination / signs"
						}
				]
		}
		
		Keterangan :
			Data yang harus ditambahkan pada API ini dapat dilihat pada link ini https://www.hl7.org/fhir/valueset-investigation-sets.html

		
	e. put
		Method : PUT
		Url format : host:port/{apikey}/investigation-sets/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/investigation-sets/100
		body:
			{
				"code" : "271336007",
				"display" : "Examination / signs"
			}
		response : 
		{
				"err_code": 0,
				"err_msg": "Investigation Sets has been update.",
				"data": [
						{
								"id": "100",
								"code": "271336007",
								"display": "Examination / signs"
						}
				]
		}
		
33. clinicalimpression-prognosis
	a. get all data
		Method : GET 
		Url format : host:port/{apikey}/clinicalimpression-prognosis
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/clinicalimpression-prognosis
		
	b. get by id
		Method : GET
		Url format : host:port/{apikey}/clinicalimpression-prognosis/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/clinicalimpression-prognosis/130
	
	c. Get data by code
		Method : GET
		Url format : host:port/{apikey}/clinicalimpression-prognosis/code/{code}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/clinicalimpression-prognosis/code/60486009
		
	d. Add 
		Method : POST
		Url format : host:port/{apikey}/clinicalimpression-prognosis
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/clinicalimpression-prognosis
		body : 
			{
				"code" : "60486009",
				"display" : "Conditional prognosis",
				"definition" : ""
			}
			
		response : 
		{
				"err_code": 0,
				"err_msg": "Clinicalimpression Prognosis has been add.",
				"data": [
						{
								"id": "100",
								"code": "60486009",
								"display": "Conditional prognosis",
								"definition": "null"
						}
				]
		}
		
		Keterangan :
			Data yang harus ditambahkan pada API ini dapat dilihat pada link ini https://www.hl7.org/fhir/valueset-clinicalimpression-prognosis.html

			
	e. put
		Method : PUT
		Url format : host:port/{apikey}/clinicalimpression-prognosis/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/clinicalimpression-prognosis/100
		body:
			{
				"code" : "271336007",
				"display" : "Examination / signs"
			}
		response : 
		{
				"err_code": 0,
				"err_msg": "Clinicalimpression Prognosis has been update.",
				"data": [
						{
								"id": "100",
								"code": "60486009",
								"display": "Conditional prognosis",
								"definition": "null"
						}
				]
		}
		
34.  condition-clinical
	a. get all data
		Method : GET 
		Url format : host:port/{apikey}/condition-clinical
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/condition-clinical
		
	b. get by id
		Method : GET
		Url format : host:port/{apikey}/condition-clinical/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/condition-clinical/130
	
	c. Get data by code
		Method : GET
		Url format : host:port/{apikey}/condition-clinical/code/{code}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/condition-clinical/code/active
		
	d. Add 
		Method : POST
		Url format : host:port/{apikey}/condition-clinical
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/condition-clinical
		body : 
			{
				"code" : "active",
				"display" : "Active",
				"definition" : "The subject is currently experiencing the symptoms of the condition or there is evidence of the condition."
			}
			
		response : 
		{
				"err_code": 0,
				"err_msg": "Condition Clinical has been add.",
				"data": [
						{
								"id": "100",
								"code": "active",
								"display": "Active",
								"definition": "The subject is currently experiencing the symptoms of the condition or there is evidence of the condition."
						}
				]
		}
		
		Keterangan :
			Data yang harus ditambahkan pada API ini dapat dilihat pada link ini https://www.hl7.org/fhir/valueset-condition-clinical.html

		
	e. put
		Method : PUT
		Url format : host:port/{apikey}/condition-clinical/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/condition-clinical/100
		body:
			{
				"code" : "active",
				"display" : "Active",
				"definition" : "The subject is currently experiencing the symptoms of the condition or there is evidence of the condition."
			}
		response : 
		{
				"err_code": 0,
				"err_msg": "Condition Clinical has been update.",
				"data": [
						{
								"id": "100",
								"code": "active",
								"display": "Active",
								"definition": "The subject is currently experiencing the symptoms of the condition or there is evidence of the condition"
						}
				]
		}
		
35. condition-ver-status
	a. get all data
		Method : GET 
		Url format : host:port/{apikey}/condition-ver-status
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/condition-ver-status
		
	b. get by id
		Method : GET
		Url format : host:port/{apikey}/condition-ver-status/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/condition-ver-status/130
	
	c. Get data by code
		Method : GET
		Url format : host:port/{apikey}/condition-ver-status/code/{code}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/condition-ver-status/code/provisional
		
	d. Add 
		Method : POST
		Url format : host:port/{apikey}/condition-ver-status
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/condition-ver-status
		body : 
			{
				"code" : "provisional",
				"display" : "Provisional",
				"definition" : "This is a tentative diagnosis - still a candidate that is under consideration."
			}

		response : 
		{
				"err_code": 0,
				"err_msg": "Condition Ver Status has been add.",
				"data": [
						{
								"id": "100",
								"code": "provisional",
								"display": "Provisional",
								"definition": "This is a tentative diagnosis - still a candidate that is under consideration."
						}
				]
		}
		
		Keterangan :
			Data yang harus ditambahkan pada API ini dapat dilihat pada link ini https://www.hl7.org/fhir/valueset-condition-ver-status.html

			
	e. put
		Method : PUT
		Url format : host:port/{apikey}/condition-ver-status/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/condition-ver-status/100
		body:
			{
				"code" : "provisional",
				"display" : "Provisional",
				"definition" : "This is a tentative diagnosis - still a candidate that is under consideration."
			}
		response : 
		{
				"err_code": 0,
				"err_msg": "Condition Ver Status has been update.",
				"data": [
						{
								"id": "100",
								"code": "provisional",
								"display": "Provisional",
								"definition": "This is a tentative diagnosis  still a candidate that is under consideration"
						}
				]
		}
		
36.  condition-category
	a. get all data
		Method : GET 
		Url format : host:port/{apikey}/condition-category
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/condition-category
		
	b. get by id
		Method : GET
		Url format : host:port/{apikey}/condition-category/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/condition-category/130
	
	c. Get data by code
		Method : GET
		Url format : host:port/{apikey}/condition-category/code/{code}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/condition-category/code/problem-list-item
		
	d. Add 
		Method : POST
		Url format : host:port/{apikey}/condition-category
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/condition-category
		body : 
			{
				"code" : "problem-list-item",
				"display" : "Problem List Item",
				"definition" : "An item on a problem list which can be managed over time and can be expressed by a practitioner (e.g. physician, nurse), patient, or related person."
			}

		response : 
		{
				"err_code": 0,
				"err_msg": "Condition Category has been add.",
				"data": [
						{
								"id": "100",
								"code": "problem-list-item",
								"display": "Problem List Item",
								"definition": "An item on a problem list which can be managed over time and can be expressed by a practitioner (e.g. physician, nurse), patient, or related person."
						}
				]
		}
		
		Keterangan :
			Data yang harus ditambahkan pada API ini dapat dilihat pada link ini https://www.hl7.org/fhir/valueset-condition-category.html

			
	e. put
		Method : PUT
		Url format : host:port/{apikey}/condition-category/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/condition-category/100
		body:
			{
				"code" : "problem-list-item",
				"display" : "Problem List Item",
				"definition" : "An item on a problem list which can be managed over time and can be expressed by a practitioner (e.g. physician, nurse), patient, or related person."
			}
		response : 
		{
				"err_code": 0,
				"err_msg": "Condition Category has been update.",
				"data": [
						{
								"id": "100",
								"code": "problem-list-item",
								"display": "Problem List Item",
								"definition": "An item on a problem list which can be managed over time and can be expressed by a practitioner eg physician, nurse, patient, or related person"
						}
				]
		}
	
37. condition-severity
	a. get all data
		Method : GET 
		Url format : host:port/{apikey}/condition-severity
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/condition-severity
		
	b. get by id
		Method : GET
		Url format : host:port/{apikey}/condition-severity/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/condition-severity/130
	
	c. Get data by code
		Method : GET
		Url format : host:port/{apikey}/condition-severity/code/{code}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/condition-severity/code/24484000
		
	d. Add 
		Method : POST
		Url format : host:port/{apikey}/condition-severity
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/condition-severity
		body : 
			{
				"code" : "24484000",
				"display" : "Severe"
			}

		response : 
		{
				"err_code": 0,
				"err_msg": "Condition Severity has been add.",
				"data": [
						{
								"id": "100",
								"code": "24484000",
								"display": "Severe"
						}
				]
		}
		
		Keterangan :
			Data yang harus ditambahkan pada API ini dapat dilihat pada link ini https://www.hl7.org/fhir/valueset-condition-severity.html

			
	e. put
		Method : PUT
		Url format : host:port/{apikey}/condition-severity/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/condition-severity/100
		body:
			{
				"code" : "24484000",
				"display" : "Severe"
			}
		response : 
		{
				"err_code": 0,
				"err_msg": "Condition Severity has been update.",
				"data": [
						{
								"id": "100",
								"code": "24484000",
								"display": "Severe"
						}
				]
		}
		
38. condition-code
	a. get all data
		Method : GET 
		Url format : host:port/{apikey}/condition-code
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/condition-code
		
	b. get by id
		Method : GET
		Url format : host:port/{apikey}/condition-code/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/condition-code/130
	
	c. Get data by code
		Method : GET
		Url format : host:port/{apikey}/condition-code/code/{code}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/condition-code/code/109006
		
	d. Add 
		Method : POST
		Url format : host:port/{apikey}/condition-code
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/condition-code
		body : 
			{
				"code" : "109006",
				"display" : "Anxiety disorder of childhood OR adolescence",
				"definition" : ""
			}

		response : 
		{
				"err_code": 0,
				"err_msg": "Condition Code has been add.",
				"data": [
						{
								"id": "100",
								"code": "109006",
								"display": "Anxiety disorder of childhood OR adolescence",
								"definition": "null"
						}
				]
		}
		
		Keterangan :
			Data yang harus ditambahkan pada API ini dapat dilihat pada link ini https://www.hl7.org/fhir/valueset-condition-code.html

			
	e. put
		Method : PUT
		Url format : host:port/{apikey}/condition-code/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/condition-code/100
		body:
			{
				"code" : "109006",
				"display" : "Anxiety disorder of childhood OR adolescence",
				"definition" : ""
			}
		response : 
		{
				"err_code": 0,
				"err_msg": "Condition Code has been update.",
				"data": [
						{
								"id": "100",
								"code": "109006",
								"display": "Anxiety disorder of childhood OR adolescence",
								"definition": "null"
						}
				]
		}
		
39. body-site
	a. get all data
		Method : GET 
		Url format : host:port/{apikey}/body-site
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/body-site
		
	b. get by id
		Method : GET
		Url format : host:port/{apikey}/body-site/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/body-site/130
	
	c. Get data by code
		Method : GET
		Url format : host:port/{apikey}/body-site/code/{code}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/body-site/code/106004
		
	d. Add 
		Method : POST
		Url format : host:port/{apikey}/body-site
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/body-site
		body : 
			{
				"code" : "106004",
				"display" : "Posterior carpal region",
				"definition" : ""
			}

		response : 
		{
				"err_code": 0,
				"err_msg": "Body Site has been add.",
				"data": [
						{
								"id": "100",
								"code": "106004",
								"display": "Posterior carpal region",
								"definition": "null"
						}
				]
		}
		
		Keterangan :
			Data yang harus ditambahkan pada API ini dapat dilihat pada link ini https://www.hl7.org/fhir/valueset-body-site.html

			
	e. put
		Method : PUT
		Url format : host:port/{apikey}/body-site/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/body-site/100
		body:
			{
				"code" : "106004",
				"display" : "Posterior carpal region",
				"definition" : ""
			}
		response : 
		{
				"err_code": 0,
				"err_msg": "Body Site has been update.",
				"data": [
						{
								"id": "100",
								"code": "106004",
								"display": "Posterior carpal region",
								"definition": "null"
						}
				]
		}
		
40. condition-stage
	a. get all data
		Method : GET 
		Url format : host:port/{apikey}/condition-stage
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/condition-stage
		
	b. get by id
		Method : GET
		Url format : host:port/{apikey}/condition-stage/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/condition-stage/130
	
	c. Get data by code
		Method : GET
		Url format : host:port/{apikey}/condition-stage/code/{code}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/condition-stage/code/786005
		
	d. Add 
		Method : POST
		Url format : host:port/{apikey}/condition-stage
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/condition-stage
		body : 
			{
				"code" : "786005",
				"display" : "Clinical stage I B",
				"definition" : ""
			}

		response : 
		{
				"err_code": 0,
				"err_msg": "Condition Stage has been add.",
				"data": [
						{
								"id": "100",
								"code": "786005",
								"display": "Clinical stage I B",
								"definition": "null"
						}
				]
		}
		
		Keterangan :
			Data yang harus ditambahkan pada API ini dapat dilihat pada link ini https://www.hl7.org/fhir/valueset-condition-stage.html

			
	e. put
		Method : PUT
		Url format : host:port/{apikey}/condition-stage/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/condition-stage/100
		body:
			{
				"code" : "786005",
				"display" : "Clinical stage I B",
				"definition" : ""
			}
		response : 
		{
				"err_code": 0,
				"err_msg": "Condition Stage has been update.",
				"data": [
						{
								"id": "100",
								"code": "786005",
								"display": "Clinical stage I B",
								"definition": "null"
						}
				]
		}	
		
41. manifestation-or-symptom
	a. get all data
		Method : GET 
		Url format : host:port/{apikey}/manifestation-or-symptom
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/manifestation-or-symptom
		
	b. get by id
		Method : GET
		Url format : host:port/{apikey}/manifestation-or-symptom/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/manifestation-or-symptom/130
	
	c. Get data by code
		Method : GET
		Url format : host:port/{apikey}/manifestation-or-symptom/code/{code}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/manifestation-or-symptom/code/786005
		
	d. Add 
		Method : POST
		Url format : host:port/{apikey}/manifestation-or-symptom
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/manifestation-or-symptom
		body : 
			{
				"code": "109006",
				"display": "Anxiety disorder of childhood OR adolescence",
				"definition": "null"
			}

		response : 
		{
				"err_code": 0,
				"err_msg": "Manifestation Or Symptom has been add.",
				"data": [
						{
								"id": "100",
								"code": "109006",
								"display": "Anxiety disorder of childhood OR adolescence",
								"definition": "null"
						}
				]
		}
		
		Keterangan :
			Data yang harus ditambahkan pada API ini dapat dilihat pada link ini https://www.hl7.org/fhir/valueset-manifestation-or-symptom.html

			
	e. put
		Method : PUT
		Url format : host:port/{apikey}/manifestation-or-symptom/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/manifestation-or-symptom/100
		body:
			{
				"code": "109006",
				"display": "Anxiety disorder of childhood OR adolescence",
				"definition": "null"
			}
		response : 
		{
				"err_code": 0,
				"err_msg": "Manifestation Or Symptom has been update.",
				"data": [
						{
								"id": "100",
								"code": "109006",
								"display": "Anxiety disorder of childhood OR adolescence",
								"definition": "null"
						}
				]
		}	
		
42. observation-status
	a. get all data
		Method : GET 
		Url format : host:port/{apikey}/observation-status
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/observation-status
		
	b. get by id
		Method : GET
		Url format : host:port/{apikey}/observation-status/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/observation-status/130
	
	c. Get data by code
		Method : GET
		Url format : host:port/{apikey}/observation-status/code/{code}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/observation-status/code/registered
		
	d. Add 
		Method : POST
		Url format : host:port/{apikey}/observation-status
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/observation-status
		body : 
			{
				"code" : "registered",
				"display" : "Registered",
				"definition" : "The existence of the observation is registered, but there is no result yet available."
			}

		response : 
		{
				"err_code": 0,
				"err_msg": "Observation Status has been add.",
				"data": [
						{
								"id": "100",
								"code": "registered",
								"display": "Registered",
								"definition": "The existence of the observation is registered, but there is no result yet available."
						}
				]
		}
		
		Keterangan :
			Data yang harus ditambahkan pada API ini dapat dilihat pada link ini https://www.hl7.org/fhir/valueset-observation-status.html

			
	e. put
		Method : PUT
		Url format : host:port/{apikey}/observation-status/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/observation-status/100
		body:
			{
				"code" : "registered",
				"display" : "Registered",
				"definition" : "The existence of the observation is registered, but there is no result yet available."
			}
		response : 
		{
				"err_code": 0,
				"err_msg": "Observation Status has been update.",
				"data": [
						{
								"id": "100",
								"code": "registered",
								"display": "Registered",
								"definition": "The existence of the observation is registered, but there is no result yet available"
						}
				]
		}
		
43. detectedissue-category
	a. get all data
		Method : GET 
		Url format : host:port/{apikey}/detectedissue-category
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/detectedissue-category
		
	b. get by id
		Method : GET
		Url format : host:port/{apikey}/detectedissue-category/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/detectedissue-category/130
	
	c. Get data by code
		Method : GET
		Url format : host:port/{apikey}/detectedissue-category/code/{code}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/detectedissue-category/code/FOOD
		
	d. Add 
		Method : POST
		Url format : host:port/{apikey}/detectedissue-category
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/detectedissue-category
		body : 
			{
				"code" : "FOOD",
				"display" : "Food Interaction Alert",
				"definition" : "Proposed therapy may interact with certain foods"
			}

		response : 
		{
				"err_code": 0,
				"err_msg": "Detectedissue Category has been add.",
				"data": [
						{
								"id": "100",
								"code": "FOOD",
								"display": "Food Interaction Alert",
								"definition": "Proposed therapy may interact with certain foods"
						}
				]
		}
		
		Keterangan :
			Data yang harus ditambahkan pada API ini dapat dilihat pada link ini https://www.hl7.org/fhir/valueset-detectedissue-category.html

			
	e. put
		Method : PUT
		Url format : host:port/{apikey}/detectedissue-category/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/detectedissue-category/100
		body:
			{
				"code" : "FOOD",
				"display" : "Food Interaction Alert",
				"definition" : "Proposed therapy may interact with certain foods"
			}
		response : 
		{
				"err_code": 0,
				"err_msg": "Detectedissue Category has been update.",
				"data": [
						{
								"id": "100",
								"code": "FOOD",
								"display": "Food Interaction Alert",
								"definition": "Proposed therapy may interact with certain foods"
						}
				]
		}
		
44. detectedissue-severity
	a. get all data
		Method : GET 
		Url format : host:port/{apikey}/detectedissue-severity
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/detectedissue-severity
		
	b. get by id
		Method : GET
		Url format : host:port/{apikey}/detectedissue-severity/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/detectedissue-severity/130
	
	c. Get data by code
		Method : GET
		Url format : host:port/{apikey}/detectedissue-severity/code/{code}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/detectedissue-severity/code/high
		
	d. Add 
		Method : POST
		Url format : host:port/{apikey}/detectedissue-severity
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/detectedissue-severity
		body : 
			{
				"code" : "high",
				"display" : "High",
				"definition" : "Indicates the issue may be life-threatening or has the potential to cause permanent injury."
			}

		response : 
		{
				"err_code": 0,
				"err_msg": "Detectedissue Severity has been add.",
				"data": [
						{
								"id": "100",
								"code": "high",
								"display": "High",
								"definition": "Indicates the issue may be life-threatening or has the potential to cause permanent injury."
						}
				]
		}
		
		Keterangan :
			Data yang harus ditambahkan pada API ini dapat dilihat pada link ini https://www.hl7.org/fhir/valueset-detectedissue-severity.html

			
	e. put
		Method : PUT
		Url format : host:port/{apikey}/detectedissue-severity/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/detectedissue-severity/100
		body:
			{
				"code" : "high",
				"display" : "High",
				"definition" : "Indicates the issue may be life-threatening or has the potential to cause permanent injury."
			}
		response : 
		{
				"err_code": 0,
				"err_msg": "Detectedissue Severity has been update.",
				"data": [
						{
								"id": "100",
								"code": "high",
								"display": "High",
								"definition": "Indicates the issue may be lifethreatening or has the potential to cause permanent injury"
						}
				]
		}
		
45. detectedissue-mitigation-action
	a. get all data
		Method : GET 
		Url format : host:port/{apikey}/detectedissue-mitigation-action
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/detectedissue-mitigation-action
		
	b. get by id
		Method : GET
		Url format : host:port/{apikey}/detectedissue-mitigation-action/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/detectedissue-mitigation-action/130
	
	c. Get data by code
		Method : GET
		Url format : host:port/{apikey}/detectedissue-mitigation-action/code/{code}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/detectedissue-mitigation-action/code/_ActDetectedIssueManagementCode
		
	d. Add 
		Method : POST
		Url format : host:port/{apikey}/detectedissue-mitigation-action
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/detectedissue-mitigation-action
		body : 
			{
				"code" : "_ActDetectedIssueManagementCode",
				"display" : "ActDetectedIssueManagementCode",
				"definition" : "Codes dealing with the management of Detected Issue observations"
			}

		response : 
		{
				"err_code": 0,
				"err_msg": "Detectedissue Mitigation Action has been add.",
				"data": [
						{
								"id": "100",
								"code": "_ActDetectedIssueManagementCode",
								"display": "ActDetectedIssueManagementCode",
								"definition": "Codes dealing with the management of Detected Issue observations"
						}
				]
		}
		
		Keterangan :
			Data yang harus ditambahkan pada API ini dapat dilihat pada link ini https://www.hl7.org/fhir/valueset-detectedissue-mitigation-action.html

			
	e. put
		Method : PUT
		Url format : host:port/{apikey}/detectedissue-mitigation-action/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/detectedissue-mitigation-action/100
		body:
			{
				"code" : "_ActDetectedIssueManagementCode",
				"display" : "ActDetectedIssueManagementCode",
				"definition" : "Codes dealing with the management of Detected Issue observations"
			}
		response : 
		{
				"err_code": 0,
				"err_msg": "Detectedissue Mitigation Action has been update.",
				"data": [
						{
								"id": "100",
								"code": "_ActDetectedIssueManagementCode",
								"display": "ActDetectedIssueManagementCode",
								"definition": "Codes dealing with the management of Detected Issue observations"
						}
				]
		}
		
46. history-status
	a. get all data
		Method : GET 
		Url format : host:port/{apikey}/history-status
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/history-status
		
	b. get by id
		Method : GET
		Url format : host:port/{apikey}/history-status/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/history-status/130
	
	c. Get data by code
		Method : GET
		Url format : host:port/{apikey}/history-status/code/{code}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/history-status/code/partial
		
	d. Add 
		Method : POST
		Url format : host:port/{apikey}/history-status
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/history-status
		body : 
			{
				"code" : "partial",
				"display" : "Partial",
				"definition" : "Some health information is known and captured, but not complete - see notes for details."
			}

		response : 
		{
				"err_code": 0,
				"err_msg": "History Status has been add.",
				"data": [
						{
								"id": "101",
								"code": "partial",
								"display": "Partial",
								"definition": "Some health information is known and captured, but not complete - see notes for details."
						}
				]
		}
		
		Keterangan :
			Data yang harus ditambahkan pada API ini dapat dilihat pada link ini https://www.hl7.org/fhir/valueset-history-status.html

			
	e. put
		Method : PUT
		Url format : host:port/{apikey}/history-status/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/history-status/100
		body:
			{
				"code" : "partial",
				"display" : "Partial",
				"definition" : "Some health information is known and captured, but not complete - see notes for details."
			}
		response : 
		{
				"err_code": 0,
				"err_msg": "History Status has been update.",
				"data": [
						{
								"id": "101",
								"code": "partial",
								"display": "Partial",
								"definition": "Some health information is known and captured, but not complete  see notes for details"
						}
				]
		}
		
47. history-not-done-reason
	a. get all data
		Method : GET 
		Url format : host:port/{apikey}/history-not-done-reason
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/history-not-done-reason
		
	b. get by id
		Method : GET
		Url format : host:port/{apikey}/history-not-done-reason/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/history-not-done-reason/130
	
	c. Get data by code
		Method : GET
		Url format : host:port/{apikey}/history-not-done-reason/code/{code}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/history-not-done-reason/code/subject-unknown
		
	d. Add 
		Method : POST
		Url format : host:port/{apikey}/history-not-done-reason
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/history-not-done-reason
		body : 
			{
				"code" : "subject-unknown",
				"display" : "Subject Unknown",
				"definition" : "Patient does not know the subject, e.g. the biological parent of an adopted patient."
			}

		response : 
		{
				"err_code": 0,
				"err_msg": "History Not Done Reason has been add.",
				"data": [
						{
								"id": "102",
								"code": "subject-unknown",
								"display": "Subject Unknown",
								"definition": "Patient does not know the subject, e.g. the biological parent of an adopted patient."
						}
				]
		}
		
		Keterangan :
			Data yang harus ditambahkan pada API ini dapat dilihat pada link ini https://www.hl7.org/fhir/valueset-history-not-done-reason.html

			
	e. put
		Method : PUT
		Url format : host:port/{apikey}/history-not-done-reason/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/history-not-done-reason/100
		body:
			{
				"code" : "subject-unknown",
				"display" : "Subject Unknown",
				"definition" : "Patient does not know the subject, e.g. the biological parent of an adopted patient."
			}
		response : 
		{
				"err_code": 0,
				"err_msg": "History Not Done Reason has been update.",
				"data": [
						{
								"id": "102",
								"code": "subject-unknown",
								"display": "Subject Unknown",
								"definition": "Patient does not know the subject, eg the biological parent of an adopted patient"
						}
				]
		}
		
48. family-member
	a. get all data
		Method : GET 
		Url format : host:port/{apikey}/family-member
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/family-member
		
	b. get by id
		Method : GET
		Url format : host:port/{apikey}/family-member/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/family-member/130
	
	c. Get data by code
		Method : GET
		Url format : host:port/{apikey}/family-member/code/{code}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/family-member/code/FAMMEMB
		
	d. Add 
		Method : POST
		Url format : host:port/{apikey}/family-member
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/family-member
		body : 
			{
				"code" : "FAMMEMB",
				"display" : "family member",
				"definition" : "A relationship between two people characterizing their familial relationship"
			}

		response : 
		{
				"err_code": 0,
				"err_msg": "Family Member has been add.",
				"data": [
						{
								"id": "100",
								"code": "FAMMEMB",
								"display": "family member",
								"definition": "A relationship between two people characterizing their familial relationship"
						}
				]
		}
		
		Keterangan :
			Data yang harus ditambahkan pada API ini dapat dilihat pada link ini https://www.hl7.org/fhir/v3/FamilyMember/vs.html

			
	e. put
		Method : PUT
		Url format : host:port/{apikey}/family-member/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/family-member/100
		body:
			{
				"code" : "FAMMEMB",
				"display" : "family member",
				"definition" : "A relationship between two people characterizing their familial relationship"
			}
		response : 
		{
				"err_code": 0,
				"err_msg": "Family Member has been update.",
				"data": [
						{
								"id": "100",
								"code": "FAMMEMB",
								"display": "family member",
								"definition": "A relationship between two people characterizing their familial relationship"
						}
				]
		}
		
49. condition-outcome
	a. get all data
		Method : GET 
		Url format : host:port/{apikey}/condition-outcome
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/condition-outcome
		
	b. get by id
		Method : GET
		Url format : host:port/{apikey}/condition-outcome/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/condition-outcome/130
	
	c. Get data by code
		Method : GET
		Url format : host:port/{apikey}/condition-outcome/code/{code}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/condition-outcome/code/109006
		
	d. Add 
		Method : POST
		Url format : host:port/{apikey}/condition-outcome
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/condition-outcome
		body : 
			{
				"code" : "109006",
				"display" : "Anxiety disorder of childhood OR adolescence",
				"definition" : ""
			}

		response : 
		{
				"err_code": 0,
				"err_msg": "Condition Outcome has been add.",
				"data": [
						{
								"id": "100",
								"code": "109006",
								"display": "Anxiety disorder of childhood OR adolescence",
								"definition": "null"
						}
				]
		}
		
		Keterangan :
			Data yang harus ditambahkan pada API ini dapat dilihat pada link ini https://www.hl7.org/fhir/valueset-condition-outcome.html

			
	e. put
		Method : PUT
		Url format : host:port/{apikey}/condition-outcome/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/condition-outcome/100
		body:
			{
				"code" : "109006",
				"display" : "Anxiety disorder of childhood OR adolescence",
				"definition" : ""
			}
		response : 
		{
				"err_code": 0,
				"err_msg": "Condition Outcome has been update.",
				"data": [
						{
								"id": "100",
								"code": "109006",
								"display": "Anxiety disorder of childhood OR adolescence",
								"definition": "null"
						}
				]
		}
		
50. risk-probability
	a. get all data
		Method : GET 
		Url format : host:port/{apikey}/risk-probability
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/risk-probability
		
	b. get by id
		Method : GET
		Url format : host:port/{apikey}/risk-probability/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/risk-probability/130
	
	c. Get data by code
		Method : GET
		Url format : host:port/{apikey}/risk-probability/code/{code}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/risk-probability/code/negligible
		
	d. Add 
		Method : POST
		Url format : host:port/{apikey}/risk-probability
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/risk-probability
		body : 
			{
				"code" : "negligible",
				"display" : "Negligible",
				"definition" : "The specified outcome is exceptionally unlikely."
			}

		response : 
		{
				"err_code": 0,
				"err_msg": "Risk Probability has been add.",
				"data": [
						{
								"id": "103",
								"code": "negligible",
								"display": "Negligible",
								"definition": "The specified outcome is exceptionally unlikely."
						}
				]
		}
		
		Keterangan :
			Data yang harus ditambahkan pada API ini dapat dilihat pada link ini https://www.hl7.org/fhir/valueset-risk-probability.html

			
	e. put
		Method : PUT
		Url format : host:port/{apikey}/risk-probability/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/risk-probability/100
		body:
			{
				"code" : "negligible",
				"display" : "Negligible",
				"definition" : "The specified outcome is exceptionally unlikely."
			}
		response : 
		{
				"err_code": 0,
				"err_msg": "Risk Probability has been update.",
				"data": [
						{
								"id": "103",
								"code": "negligible",
								"display": "Negligible",
								"definition": "The specified outcome is exceptionally unlikely"
						}
				]
		}
		
51. goal-status
	a. get all data
		Method : GET 
		Url format : host:port/{apikey}/goal-status
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/goal-status
		
	b. get by id
		Method : GET
		Url format : host:port/{apikey}/goal-status/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/goal-status/130
	
	c. Get data by code
		Method : GET
		Url format : host:port/{apikey}/goal-status/code/{code}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/goal-status/code/proposed
		
	d. Add 
		Method : POST
		Url format : host:port/{apikey}/goal-status
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/goal-status
		body : 
			{
				"code" : "proposed",
				"display" : "Proposed",
				"definition" : "A goal is proposed for this patient"
			}

		response : 
		{
				"err_code": 0,
				"err_msg": "Goal Status has been add.",
				"data": [
						{
								"id": "100",
								"code": "proposed",
								"display": "Proposed",
								"definition": "A goal is proposed for this patient"
						}
				]
		}
		
		Keterangan :
			Data yang harus ditambahkan pada API ini dapat dilihat pada link ini https://www.hl7.org/fhir/valueset-goal-status.html

			
	e. put
		Method : PUT
		Url format : host:port/{apikey}/goal-status/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/goal-status/100
		body:
			{
				"code" : "proposed",
				"display" : "Proposed",
				"definition" : "A goal is proposed for this patient"
			}
		response : 
		{
				"err_code": 0,
				"err_msg": "Goal Status has been update.",
				"data": [
						{
								"id": "100",
								"code": "proposed",
								"display": "Proposed",
								"definition": "A goal is proposed for this patient"
						}
				]
		}
		
52. goal-category
	a. get all data
		Method : GET 
		Url format : host:port/{apikey}/goal-category
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/goal-category
		
	b. get by id
		Method : GET
		Url format : host:port/{apikey}/goal-category/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/goal-category/130
	
	c. Get data by code
		Method : GET
		Url format : host:port/{apikey}/goal-category/code/{code}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/goal-category/code/dietary
		
	d. Add 
		Method : POST
		Url format : host:port/{apikey}/goal-category
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/goal-category
		body : 
			{
				"code" : "dietary",
				"display" : "Dietary",
				"definition" : "Goals related to the consumption of food and/or beverages."
			}

		response : 
		{
				"err_code": 0,
				"err_msg": "Goal Category has been add.",
				"data": [
						{
								"id": "100",
								"code": "dietary",
								"display": "Dietary",
								"definition": "Goals related to the consumption of food and/or beverages."
						}
				]
		}
		
		Keterangan :
			Data yang harus ditambahkan pada API ini dapat dilihat pada link ini https://www.hl7.org/fhir/valueset-goal-category.html

			
	e. put
		Method : PUT
		Url format : host:port/{apikey}/goal-category/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/goal-category/100
		body:
			{
				"code" : "dietary",
				"display" : "Dietary",
				"definition" : "Goals related to the consumption of food and/or beverages."
			}
		response : 
		{
				"err_code": 0,
				"err_msg": "Goal Category has been update.",
				"data": [
						{
								"id": "100",
								"code": "dietary",
								"display": "Dietary",
								"definition": "Goals related to the consumption of food andor beverages"
						}
				]
		}
		
53. goal-priority
	a. get all data
		Method : GET 
		Url format : host:port/{apikey}/goal-priority
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/goal-priority
		
	b. get by id
		Method : GET
		Url format : host:port/{apikey}/goal-priority/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/goal-priority/130
	
	c. Get data by code
		Method : GET
		Url format : host:port/{apikey}/goal-priority/code/{code}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/goal-priority/code/high-priority
		
	d. Add 
		Method : POST
		Url format : host:port/{apikey}/goal-priority
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/goal-priority
		body : 
			{
				"code" : "high-priority",
				"display" : "High Priority",
				"definition" : "Indicates that the goal is of considerable importance and should be a primary focus of care delivery."
			}

		response : 
		{
				"err_code": 0,
				"err_msg": "Goal Priority has been add.",
				"data": [
						{
								"id": "100",
								"code": "high-priority",
								"display": "High Priority",
								"definition": "Indicates that the goal is of considerable importance and should be a primary focus of care delivery."
						}
				]
		}
		
		Keterangan :
			Data yang harus ditambahkan pada API ini dapat dilihat pada link ini https://www.hl7.org/fhir/valueset-goal-priority.html

		
	e. put
		Method : PUT
		Url format : host:port/{apikey}/goal-priority/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/goal-priority/100
		body:
			{
				"code" : "high-priority",
				"display" : "High Priority",
				"definition" : "Indicates that the goal is of considerable importance and should be a primary focus of care delivery."
			}
		response : 
		{
				"err_code": 0,
				"err_msg": "Goal Priority has been update.",
				"data": [
						{
								"id": "100",
								"code": "high-priority",
								"display": "High Priority",
								"definition": "Indicates that the goal is of considerable importance and should be a primary focus of care delivery"
						}
				]
		}
		
54. goal-start-event
	a. get all data
		Method : GET 
		Url format : host:port/{apikey}/goal-start-event
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/goal-start-event
		
	b. get by id
		Method : GET
		Url format : host:port/{apikey}/goal-start-event/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/goal-start-event/130
	
	c. Get data by code
		Method : GET
		Url format : host:port/{apikey}/goal-start-event/code/{code}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/goal-start-event/code/32485007
		
	d. Add 
		Method : POST
		Url format : host:port/{apikey}/goal-start-event
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/goal-start-event
		body : 
			{
				"code" : "32485007",
				"display" : "High Priority"
			}

		response : 
		{
				"err_code": 0,
				"err_msg": "Goal Start Event has been add.",
				"data": [
						{
								"id": "100",
								"code": "32485007",
								"display": "High Priority"
						}
				]
		}
		
		Keterangan :
			Data yang harus ditambahkan pada API ini dapat dilihat pada link ini https://www.hl7.org/fhir/valueset-goal-start-event.html

			
	e. put
		Method : PUT
		Url format : host:port/{apikey}/goal-start-event/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/goal-start-event/100
		body:
			{
				"code" : "32485007",
				"display" : "High Priority"
			}
		response : 
		{
				"err_code": 0,
				"err_msg": "Goal Start Event has been update.",
				"data": [
						{
								"id": "100",
								"code": "32485007",
								"display": "High Priority"
						}
				]
		}
		
55. observation-codes
	a. get all data
		Method : GET 
		Url format : host:port/{apikey}/observation-codes
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/observation-codes
		
	b. get by id
		Method : GET
		Url format : host:port/{apikey}/observation-codes/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/observation-codes/130
	
	c. Get data by code
		Method : GET
		Url format : host:port/{apikey}/observation-codes/code/{code}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/observation-codes/code/1-8
		
	d. Add 
		Method : POST
		Url format : host:port/{apikey}/observation-codes
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/observation-codes
		body : 
			{
				"code" : "1-8",
				"display" : "HAcyclovir [Susceptibility]"
			}

		response : 
		{
				"err_code": 0,
				"err_msg": "Observation Codes has been add.",
				"data": [
						{
								"id": "100",
								"code": "1-8",
								"display": "HAcyclovir [Susceptibility]"
						}
				]
		}
		
		Keterangan :
			Data yang harus ditambahkan pada API ini dapat dilihat pada link ini https://www.hl7.org/fhir/valueset-observation-codes.html

			
	e. put
		Method : PUT
		Url format : host:port/{apikey}/observation-codes/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/observation-codes/100
		body:
			{
				"code" : "1-8",
				"display" : "HAcyclovir [Susceptibility]"
			}
		response : 
		{
				"err_code": 0,
				"err_msg": "Observation Codes has been update.",
				"data": [
						{
								"id": "100",
								"code": "1-8",
								"display": "HAcyclovir [Susceptibility]"
						}
				]
		}
		
56. event-status
	a. get all data
		Method : GET 
		Url format : host:port/{apikey}/event-status
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/event-status
		
	b. get by id
		Method : GET
		Url format : host:port/{apikey}/event-status/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/event-status/130
	
	c. Get data by code
		Method : GET
		Url format : host:port/{apikey}/event-status/code/{code}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/event-status/code/preparation
		
	d. Add 
		Method : POST
		Url format : host:port/{apikey}/event-status
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/event-status
		body : 
			{
				"code" : "preparation",
				"display" : "Preparation",
				"definition" : "The core event has not started yet, but some staging activities have begun (e.g. surgical suite preparation). Preparation stages may be tracked for billing purposes."
			}

		response : 
		{
				"err_code": 0,
				"err_msg": "Event Status has been add.",
				"data": [
						{
								"id": "100",
								"code": "preparation",
								"display": "Preparation",
								"definition": "The core event has not started yet, but some staging activities have begun (e.g. surgical suite preparation). Preparation stages may be tracked for billing purposes."
						}
				]
		}
		
		Keterangan :
			Data yang harus ditambahkan pada API ini dapat dilihat pada link ini https://www.hl7.org/fhir/valueset-event-status.html

		
	e. put
		Method : PUT
		Url format : host:port/{apikey}/event-status/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/event-status/100
		body:
			{
				"code" : "preparation",
				"display" : "Preparation",
				"definition" : "The core event has not started yet, but some staging activities have begun (e.g. surgical suite preparation). Preparation stages may be tracked for billing purposes."
			}
		response : 
		{
				"err_code": 0,
				"err_msg": "Event Status has been update.",
				"data": [
						{
								"id": "100",
								"code": "preparation",
								"display": "Preparation",
								"definition": "The core event has not started yet, but some staging activities have begun eg surgical suite preparation Preparation stages may be tracked for billing purposes"
						}
				]
		}

57. procedure-not-performed-reason
	a. get all data
		Method : GET 
		Url format : host:port/{apikey}/procedure-not-performed-reason
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/procedure-not-performed-reason
		
	b. get by id
		Method : GET
		Url format : host:port/{apikey}/procedure-not-performed-reason/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/procedure-not-performed-reason/130
	
	c. Get data by code
		Method : GET
		Url format : host:port/{apikey}/procedure-not-performed-reason/code/{code}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/procedure-not-performed-reason/code/135809002
		
	d. Add 
		Method : POST
		Url format : host:port/{apikey}/procedure-not-performed-reason
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/procedure-not-performed-reason
		body : 
			{
				"code" : "135809002",
				"display" : "Nitrate contraindicated",
				"definition" : ""
			}

		response : 
		{
				"err_code": 0,
				"err_msg": "Procedure Not Performed Reason has been add.",
				"data": [
						{
								"id": "100",
								"code": "135809002",
								"display": "Nitrate contraindicated",
								"definition": "null"
						}
				]
		}
		
		Keterangan :
			Data yang harus ditambahkan pada API ini dapat dilihat pada link ini https://www.hl7.org/fhir/valueset-procedure-not-performed-reason.html

		
	e. put
		Method : PUT
		Url format : host:port/{apikey}/procedure-not-performed-reason/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/procedure-not-performed-reason/100
		body:
			{
				"code" : "135809002",
				"display" : "Nitrate contraindicated",
				"definition" : ""
			}
		response : 
		{
				"err_code": 0,
				"err_msg": "Procedure Not Performed Reason has been update.",
				"data": [
						{
								"id": "100",
								"code": "135809002",
								"display": "Nitrate contraindicated",
								"definition": "null"
						}
				]
		}
		
58.  procedure-category
	a. get all data
		Method : GET 
		Url format : host:port/{apikey}/procedure-category
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/procedure-category
		
	b. get by id
		Method : GET
		Url format : host:port/{apikey}/procedure-category/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/procedure-category/130
	
	c. Get data by code
		Method : GET
		Url format : host:port/{apikey}/procedure-category/code/{code}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/procedure-category/code/409063005
		
	d. Add 
		Method : POST
		Url format : host:port/{apikey}/procedure-category
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/procedure-category
		body : 
			{
				"code" : "409063005",
				"display" : "Counselling"
			}

		response : 
		{
				"err_code": 0,
				"err_msg": "Procedure Category has been add.",
				"data": [
						{
								"id": "100",
								"code": "409063005",
								"display": "Counselling"
						}
				]
		}
		
		Keterangan :
			Data yang harus ditambahkan pada API ini dapat dilihat pada link ini https://www.hl7.org/fhir/valueset-procedure-category.html

		
	e. put
		Method : PUT
		Url format : host:port/{apikey}/procedure-category/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/procedure-category/100
		body:
			{
				"code" : "409063005",
				"display" : "Counselling"
			}
		response : 
		{
				"err_code": 0,
				"err_msg": "Procedure Category has been update.",
				"data": [
						{
								"id": "100",
								"code": "409063005",
								"display": "Counselling"
						}
				]
		}
		
59. procedure-code
	a. get all data
		Method : GET 
		Url format : host:port/{apikey}/procedure-code
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/procedure-code
		
	b. get by id
		Method : GET
		Url format : host:port/{apikey}/procedure-code/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/procedure-code/130
	
	c. Get data by code
		Method : GET
		Url format : host:port/{apikey}/procedure-code/code/{code}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/procedure-code/code/104001
		
	d. Add 
		Method : POST
		Url format : host:port/{apikey}/procedure-code
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/procedure-code
		body : 
			{
				"code" : "104001",
				"display" : "Excision of lesion of patella",
				"definition" : ""
			}

		response : 
		{
				"err_code": 0,
				"err_msg": "Procedure Code has been add.",
				"data": [
						{
								"id": "100",
								"code": "104001",
								"display": "Excision of lesion of patella",
								"definition": "null"
						}
				]
		}
		
		Keterangan :
			Data yang harus ditambahkan pada API ini dapat dilihat pada link ini https://www.hl7.org/fhir/valueset-procedure-code.html

		
	e. put
		Method : PUT
		Url format : host:port/{apikey}/procedure-code/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/procedure-code/100
		body:
			{
				"code" : "104001",
				"display" : "Excision of lesion of patella",
				"definition" : ""
			}
		response : 
		{
				"err_code": 0,
				"err_msg": "Procedure Code has been update.",
				"data": [
						{
								"id": "100",
								"code": "104001",
								"display": "Excision of lesion of patella",
								"definition": "null"
						}
				]
		}
		
60.		performer-role
	a. get all data
		Method : GET 
		Url format : host:port/{apikey}/performer-role
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/performer-role
		
	b. get by id
		Method : GET
		Url format : host:port/{apikey}/performer-role/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/performer-role/130
	
	c. Get data by code
		Method : GET
		Url format : host:port/{apikey}/performer-role/code/{code}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/performer-role/code/1421009
		
	d. Add 
		Method : POST
		Url format : host:port/{apikey}/performer-role
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/performer-role
		body : 
			{
				"code" : "1421009",
				"display" : "Specialized",
				"definition" : ""
			}

		response : 
		{
				"err_code": 0,
				"err_msg": "Performer Role has been add.",
				"data": [
						{
								"id": "100",
								"code": "1421009",
								"display": "Specialized",
								"definition": "null"
						}
				]
		}
		
		Keterangan :
			Data yang harus ditambahkan pada API ini dapat dilihat pada link ini https://www.hl7.org/fhir/valueset-performer-role.html

		
	e. put
		Method : PUT
		Url format : host:port/{apikey}/performer-role/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/performer-role/100
		body:
			{
				"code" : "1421009",
				"display" : "Specialized",
				"definition" : ""
			}
		response : 
		{
				"err_code": 0,
				"err_msg": "Performer Role has been update.",
				"data": [
						{
								"id": "100",
								"code": "1421009",
								"display": "Specialized",
								"definition": "null"
						}
				]
		}
		
61. procedure-reason
	a. get all data
		Method : GET 
		Url format : host:port/{apikey}/procedure-reason
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/procedure-reason
		
	b. get by id
		Method : GET
		Url format : host:port/{apikey}/procedure-reason/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/procedure-reason/130
	
	c. Get data by code
		Method : GET
		Url format : host:port/{apikey}/procedure-reason/code/{code}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/procedure-reason/code/109006
		
	d. Add 
		Method : POST
		Url format : host:port/{apikey}/procedure-reason
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/procedure-reason
		body : 
			{
				"code" : "109006",
				"display" : "Anxiety disorder of childhood OR adolescence",
				"definition" : ""
			}
		response : 
		{
				"err_code": 0,
				"err_msg": "Procedure Reason has been add.",
				"data": [
						{
								"id": "100",
								"code": "109006",
								"display": "Anxiety disorder of childhood OR adolescence",
								"definition": "null"
						}
				]
		}
		
		Keterangan :
			Data yang harus ditambahkan pada API ini dapat dilihat pada link ini https://www.hl7.org/fhir/valueset-procedure-reason.html

			
	e. put
		Method : PUT
		Url format : host:port/{apikey}/procedure-reason/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/procedure-reason/100
		body:
			{
				"code" : "109006",
				"display" : "Anxiety disorder of childhood OR adolescence",
				"definition" : ""
			}
		response : 
		{
				"err_code": 0,
				"err_msg": "Procedure Reason has been update.",
				"data": [
						{
								"id": "100",
								"code": "109006",
								"display": "Anxiety disorder of childhood OR adolescence",
								"definition": "null"
						}
				]
		}
		
62. procedure-outcome
	a. get all data
		Method : GET 
		Url format : host:port/{apikey}/procedure-outcome
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/procedure-outcome
		
	b. get by id
		Method : GET
		Url format : host:port/{apikey}/procedure-outcome/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/procedure-outcome/130
	
	c. Get data by code
		Method : GET
		Url format : host:port/{apikey}/procedure-outcome/code/{code}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/procedure-outcome/code/38669000
		
	d. Add 
		Method : POST
		Url format : host:port/{apikey}/procedure-outcome
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/procedure-outcome
		body : 
			{
				"code" : "38669000",
				"display" : "Successful"
			}
		response : 
		{
				"err_code": 0,
				"err_msg": "Procedure Outcome has been add.",
				"data": [
						{
								"id": "100",
								"code": "38669000",
								"display": "Successful"
						}
				]
		}
		
		Keterangan :
			Data yang harus ditambahkan pada API ini dapat dilihat pada link ini https://www.hl7.org/fhir/valueset-procedure-outcome.html

		
	e. put
		Method : PUT
		Url format : host:port/{apikey}/procedure-outcome/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/procedure-outcome/100
		body:
			{
				"code" : "38669000",
				"display" : "Successful"
			}
		response : 
		{
				"err_code": 0,
				"err_msg": "Procedure Outcome has been update.",
				"data": [
						{
								"id": "100",
								"code": "38669000",
								"display": "Successful"
						}
				]
		}
		
63. procedure-followup
	a. get all data
		Method : GET 
		Url format : host:port/{apikey}/procedure-followup
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/procedure-followup
		
	b. get by id
		Method : GET
		Url format : host:port/{apikey}/procedure-followup/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/procedure-followup/130
	
	c. Get data by code
		Method : GET
		Url format : host:port/{apikey}/procedure-followup/code/{code}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/procedure-followup/code/18949003
		
	d. Add 
		Method : POST
		Url format : host:port/{apikey}/procedure-followup
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/procedure-followup
		body : 
			{
				"code" : "18949003",
				"display" : "Change of dressing"
			}
		response : 
		{
				"err_code": 0,
				"err_msg": "Procedure Followup has been add.",
				"data": [
						{
								"id": "100",
								"code": "18949003",
								"display": "Change of dressing"
						}
				]
		}
		
		Keterangan :
			Data yang harus ditambahkan pada API ini dapat dilihat pada link ini https://www.hl7.org/fhir/valueset-procedure-followup.html

		
	e. put
		Method : PUT
		Url format : host:port/{apikey}/procedure-followup/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/procedure-followup/100
		body:
			{
				"code" : "18949003",
				"display" : "Change of dressing"
			}
		response : 
		{
				"err_code": 0,
				"err_msg": "Procedure Followup has been update.",
				"data": [
						{
								"id": "100",
								"code": "18949003",
								"display": "Change of dressing"
						}
				]
		}	
		
64. device-action
	a. get all data
		Method : GET 
		Url format : host:port/{apikey}/device-action
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/procedure-followup
		
	b. get by id
		Method : GET
		Url format : host:port/{apikey}/device-action/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/device-action/130
	
	c. Get data by code
		Method : GET
		Url format : host:port/{apikey}/device-action/code/{code}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/device-action/code/129265001
		
	d. Add 
		Method : POST
		Url format : host:port/{apikey}/device-action
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/device-action
		body : 
			{
				"code" : "129265001",
				"display" : "Evaluation - action",
				"definition" : ""
			}
		response : 
		{
				"err_code": 0,
				"err_msg": "Device Action has been add.",
				"data": [
						{
								"id": "100",
								"code": "129265001",
								"display": "Evaluation - action",
								"definition": "null"
						}
				]
		}
		
		Keterangan :
			Data yang harus ditambahkan pada API ini dapat dilihat pada link ini https://www.hl7.org/fhir/valueset-device-action.html

		
	e. put
		Method : PUT
		Url format : host:port/{apikey}/device-action/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/device-action/100
		body:
			{
				"code" : "129265001",
				"display" : "Evaluation - action",
				"definition" : ""
			}
		response : 
		{
				"err_code": 0,
				"err_msg": "Device Action has been update.",
				"data": [
						{
								"id": "100",
								"code": "129265001",
								"display": "Evaluation - action",
								"definition": "null"
						}
				]
		}	
		
65. device-kind
	a. get all data
		Method : GET 
		Url format : host:port/{apikey}/device-kind
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/device-kind
		
	b. get by id
		Method : GET
		Url format : host:port/{apikey}/device-kind/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/device-kind/130
	
	c. Get data by code
		Method : GET
		Url format : host:port/{apikey}/device-kind/code/{code}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/device-kind/code/156009
		
	d. Add 
		Method : POST
		Url format : host:port/{apikey}/device-kind
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/device-kind
		body : 
			{
				"code" : "156009",
				"display" : "Spine board",
				"definition" : ""
			}
		response : 
		{
				"err_code": 0,
				"err_msg": "Device Kind has been add.",
				"data": [
						{
								"id": "100",
								"code": "156009",
								"display": "Spine board",
								"definition": "null"
						}
				]
		}
		
		Keterangan :
			Data yang harus ditambahkan pada API ini dapat dilihat pada link ini https://www.hl7.org/fhir/valueset-device-kind.html

		
	e. put
		Method : PUT
		Url format : host:port/{apikey}/device-kind/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/device-kind/100
		body:
			{
				"code" : "156009",
				"display" : "Spine board",
				"definition" : ""
			}
		response : 
		{
				"err_code": 0,
				"err_msg": "Device Kind has been update.",
				"data": [
						{
								"id": "100",
								"code": "156009",
								"display": "Spine board",
								"definition": "null"
						}
				]
		}
		
66. immunization-status
	a. get all data
		Method : GET 
		Url format : host:port/{apikey}/immunization-status
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/immunization-status
		
	b. get by id
		Method : GET
		Url format : host:port/{apikey}/immunization-status/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/immunization-status/130
	
	c. Get data by code
		Method : GET
		Url format : host:port/{apikey}/immunization-status/code/{code}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/immunization-status/code/completed
		
	d. Add 
		Method : POST
		Url format : host:port/{apikey}/immunization-status
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/immunization-status
		body : 
			{
				"code" : "completed",
				"display" : "Completed",
				"definition" : "All actions that are implied by the administration have occurred."
			}
		response : 
		{
				"err_code": 0,
				"err_msg": "Immunization Status has been add.",
				"data": [
						{
								"id": "100",
								"code": "completed",
								"display": "Completed",
								"definition": "All actions that are implied by the administration have occurred."
						}
				]
		}
		
		Keterangan :
			Data yang harus ditambahkan pada API ini dapat dilihat pada link ini https://www.hl7.org/fhir/valueset-immunization-status.html
		
	e. put
		Method : PUT
		Url format : host:port/{apikey}/immunization-status/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/immunization-status/100
		body:
			{
				"code" : "completed",
				"display" : "Completed",
				"definition" : "All actions that are implied by the administration have occurred."
			}
		response : 
		{
				"err_code": 0,
				"err_msg": "Immunization Status has been update.",
				"data": [
						{
								"id": "100",
								"code": "completed",
								"display": "Completed",
								"definition": "All actions that are implied by the administration have occurred."
						}
				]
		}
		
67. vaccine-code
	a. get all data
		Method : GET 
		Url format : host:port/{apikey}/vaccine-code
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/vaccine-code
		
	b. get by id
		Method : GET
		Url format : host:port/{apikey}/vaccine-code/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/vaccine-code/130
	
	c. Get data by code
		Method : GET
		Url format : host:port/{apikey}/vaccine-code/code/{code}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/vaccine-code/code/01
		
	d. Add 
		Method : POST
		Url format : host:port/{apikey}/vaccine-code
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/vaccine-code
		body : 
			{
				"code" : "01",
				"system" : " http://hl7.org/fhir/sid/cvx",
				"display" : "DTP"
			}
		response : 
		{
				"err_code": 0,
				"err_msg": "Vaccine Code has been add.",
				"data": [
						{
								"id": "100",
								"code": "01",
								"display": "DTP",
								"system": " http://hl7.org/fhir/sid/cvx"
						}
				]
		}
		
		Keterangan :
			Data yang harus ditambahkan pada API ini dapat dilihat pada link ini https://www.hl7.org/fhir/valueset-vaccine-code.html
		
	e. put
		Method : PUT
		Url format : host:port/{apikey}/vaccine-code/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/vaccine-code/100
		body:
			{
				"code" : "01",
				"system" : " http://hl7.org/fhir/sid/cvx",
				"display" : "DTP"
			}
		response : 
		{
				"err_code": 0,
				"err_msg": "Vaccine Code has been update.",
				"data": [
						{
								"id": "100",
								"code": "01",
								"system": " http://hl7.org/fhir/sid/cvx",
								"display": "DTP"
						}
				]
		}
		
68. immunization-origin
	a. get all data
		Method : GET 
		Url format : host:port/{apikey}/immunization-origin
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/immunization-origin
		
	b. get by id
		Method : GET
		Url format : host:port/{apikey}/immunization-origin/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/immunization-origin/130
	
	c. Get data by code
		Method : GET
		Url format : host:port/{apikey}/immunization-origin/code/{code}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/immunization-origin/code/provider
		
	d. Add 
		Method : POST
		Url format : host:port/{apikey}/immunization-origin
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/immunization-origin
		body : 
			{
				"code" : "provider",
				"display" : "DTP",
				"definition" : "The data for the immunization event originated with another provider."
			}
		response : 
		{
				"err_code": 0,
				"err_msg": "Immunization Origin has been add.",
				"data": [
						{
								"id": "100",
								"code": "provider",
								"display": "DTP",
								"definition": "The data for the immunization event originated with another provider."
						}
				]
		}
		
		Keterangan :
			Data yang harus ditambahkan pada API ini dapat dilihat pada link ini https://www.hl7.org/fhir/valueset-immunization-origin.html
		
	e. put
		Method : PUT
		Url format : host:port/{apikey}/immunization-origin/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/immunization-origin/100
		body:
			{
				"code" : "provider",
				"display" : "DTP",
				"definition" : "The data for the immunization event originated with another provider."
			}
		response : 
		{
				"err_code": 0,
				"err_msg": "Immunization Origin has been update.",
				"data": [
						{
								"id": "100",
								"code": "provider",
								"display": "DTP",
								"definition": "The data for the immunization event originated with another provider."
						}
				]
		}
		
69.  immunization-site
	a. get all data
		Method : GET 
		Url format : host:port/{apikey}/immunization-site
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/immunization-site
		
	b. get by id
		Method : GET
		Url format : host:port/{apikey}/immunization-site/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/immunization-site/130
	
	c. Get data by code
		Method : GET
		Url format : host:port/{apikey}/immunization-site/code/{code}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/immunization-site/code/LA
		
	d. Add 
		Method : POST
		Url format : host:port/{apikey}/immunization-site
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/immunization-site
		body : 
			{
				"code" : "LA",
				"display" : "Left arm",
				"definition" : "left arm."
			}
		response : 
		{
				"err_code": 0,
				"err_msg": "Immunization Site has been add.",
				"data": [
						{
								"id": "100",
								"code": "LA",
								"display": "Left arm",
								"definition": "left arm."
						}
				]
		}
		
		Keterangan :
			Data yang harus ditambahkan pada API ini dapat dilihat pada link ini https://www.hl7.org/fhir/valueset-immunization-site.html
			
	e. put
		Method : PUT
		Url format : host:port/{apikey}/immunization-site/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/immunization-site/100
		body:
			{
				"code" : "LA",
				"display" : "Left arm",
				"definition" : "left arm."
			}
		response : 
		{
				"err_code": 0,
				"err_msg": "Immunization Site has been update.",
				"data": [
						{
								"id": "100",
								"code": "LA",
								"display": "Left arm",
								"definition": "left arm."
						}
				]
		}
		
70. immunization-route
	a. get all data
		Method : GET 
		Url format : host:port/{apikey}/immunization-route
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/immunization-route
		
	b. get by id
		Method : GET
		Url format : host:port/{apikey}/immunization-route/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/immunization-route/130
	
	c. Get data by code
		Method : GET
		Url format : host:port/{apikey}/immunization-route/code/{code}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/immunization-route/code/IM
		
	d. Add 
		Method : POST
		Url format : host:port/{apikey}/immunization-route
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/immunization-route
		body : 
			{
				"code" : "IM",
				"display" : "Injection, intramuscular",
				"definition" : "Injection, intramuscular."
			}
		response : 
		{
				"err_code": 0,
				"err_msg": "Immunization Routes has been add.",
				"data": [
						{
								"id": "100",
								"code": "IM",
								"display": "Injection, intramuscular",
								"definition": "Injection, intramuscular."
						}
				]
		}
		
		Keterangan :
			Data yang harus ditambahkan pada API ini dapat dilihat pada link ini https://www.hl7.org/fhir/valueset-immunization-route.html
			
	e. put
		Method : PUT
		Url format : host:port/{apikey}/immunization-route/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/immunization-route/100
		body:
			{
				"code" : "IM",
				"display" : "Injection, intramuscular",
				"definition" : "Injection, intramuscular."
			}
		response : 
		{
				"err_code": 0,
				"err_msg": "Immunization Routes has been update.",
				"data": [
						{
								"id": "100",
								"code": "IM",
								"display": "Injection, intramuscular",
								"definition": "Injection, intramuscular."
						}
				]
		}
		
71. immunization-role
	a. get all data
		Method : GET 
		Url format : host:port/{apikey}/immunization-role
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/immunization-role
		
	b. get by id
		Method : GET
		Url format : host:port/{apikey}/immunization-role/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/immunization-role/130
	
	c. Get data by code
		Method : GET
		Url format : host:port/{apikey}/immunization-role/code/{code}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/immunization-role/code/OP
		
	d. Add 
		Method : POST
		Url format : host:port/{apikey}/immunization-role
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/immunization-role
		body : 
			{
				"code" : "OP",
				"display" : "Ordering Provider"
			}
		response : 
		{
				"err_code": 0,
				"err_msg": "Immunization Role has been add.",
				"data": [
						{
								"id": "100",
								"code": "OP",
								"display": "Ordering Provider"
						}
				]
		}
		
		Keterangan :
			Data yang harus ditambahkan pada API ini dapat dilihat pada link ini https://www.hl7.org/fhir/valueset-immunization-role.html
		
	e. put
		Method : PUT
		Url format : host:port/{apikey}/immunization-role/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/immunization-role/100
		body:
			{
				"code" : "OP",
				"display" : "Ordering Provider"
			}
		response : 
		{
				"err_code": 0,
				"err_msg": "Immunization Role has been update.",
				"data": [
						{
								"id": "100",
								"code": "OP",
								"display": "Ordering Provider"
						}
				]
		}
		
72. immunization-reason
	a. get all data
		Method : GET 
		Url format : host:port/{apikey}/immunization-reason
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/immunization-reason
		
	b. get by id
		Method : GET
		Url format : host:port/{apikey}/immunization-reason/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/immunization-reason/130
	
	c. Get data by code
		Method : GET
		Url format : host:port/{apikey}/immunization-reason/code/{code}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/immunization-reason/code/281657000
		
	d. Add 
		Method : POST
		Url format : host:port/{apikey}/immunization-reason
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/immunization-reason
		body : 
			{
				"code" : "281657000",
				"display" : "Travel vaccinations"
			}
		response : 
		{
				"err_code": 0,
				"err_msg": "Immunization Reason has been add.",
				"data": [
						{
								"id": "100",
								"code": "281657000",
								"display": "Travel vaccinations"
						}
				]
		}
		
		Keterangan :
			Data yang harus ditambahkan pada API ini dapat dilihat pada link ini https://www.hl7.org/fhir/valueset-immunization-reason.html
		
	e. put
		Method : PUT
		Url format : host:port/{apikey}/immunization-reason/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/immunization-reason/100
		body:
			{
				"code" : "281657000",
				"display" : "Travel vaccinations"
			}
		response : 
		{
				"err_code": 0,
				"err_msg": "Immunization Reason has been update.",
				"data": [
						{
								"id": "100",
								"code": "281657000",
								"display": "Travel vaccinations"
						}
				]
		}
		
73. no-immunization-reason
	a. get all data
		Method : GET 
		Url format : host:port/{apikey}/no-immunization-reason
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/no-immunization-reason
		
	b. get by id
		Method : GET
		Url format : host:port/{apikey}/no-immunization-reason/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/no-immunization-reason/130
	
	c. Get data by code
		Method : GET
		Url format : host:port/{apikey}/no-immunization-reason/code/{code}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/no-immunization-reason/code/IMMUNE
		
	d. Add 
		Method : POST
		Url format : host:port/{apikey}/no-immunization-reason
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/no-immunization-reason
		body : 
			{
				"code" : "immune",
				"system" : "http://hl7.org/fhir/v3/ActReason",
				"display" : "immunity",
				"definition" : "Testing has shown that the patient already has immunity to the agent targeted by the immunization."
			}
		response : 
		{
				"err_code": 0,
				"err_msg": "No Immunization Reason has been add.",
				"data": [
						{
								"id": "100",
								"code": "IMMUNE",
								"system": "http://hl7.org/fhir/v3/ActReason",
								"display": "immunity",
								"definition": "Testing has shown that the patient already has immunity to the agent targeted by the immunization."
						}
				]
		}
		
		Keterangan :
			Data yang harus ditambahkan pada API ini dapat dilihat pada link ini https://www.hl7.org/fhir/valueset-no-immunization-reason.html
		
	e. put
		Method : PUT
		Url format : host:port/{apikey}/no-immunization-reason/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/no-immunization-reason/100
		body:
			{
				"code" : "immune",
				"system" : "http://hl7.org/fhir/v3/ActReason",
				"display" : "immunity",
				"definition" : "Testing has shown that the patient already has immunity to the agent targeted by the immunization."
			}
		response : 
		{
				"err_code": 0,
				"err_msg": "No Immunization Reason has been update.",
				"data": [
						{
								"id": "100",
								"code": "IMMUNE",
								"system": "http://hl7.org/fhir/v3/ActReason",
								"display": "immunity",
								"definition": "Testing has shown that the patient already has immunity to the agent targeted by the immunization."
						}
				]
		}
		
74. vaccination-protocol-dose-target
	a. get all data
		Method : GET 
		Url format : host:port/{apikey}/vaccination-protocol-dose-target
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/vaccination-protocol-dose-target
		
	b. get by id
		Method : GET
		Url format : host:port/{apikey}/vaccination-protocol-dose-target/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/vaccination-protocol-dose-target/130
	
	c. Get data by code
		Method : GET
		Url format : host:port/{apikey}/vaccination-protocol-dose-target/code/{code}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/vaccination-protocol-dose-target/code/1857005
		
	d. Add 
		Method : POST
		Url format : host:port/{apikey}/vaccination-protocol-dose-target
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/vaccination-protocol-dose-target
		body : 
			{
				"code" : "1857005",
				"display" : "Gestational rubella syndrome"
			}
		response : 
		{
				"err_code": 0,
				"err_msg": "Vaccination Protocol Dose Target has been add.",
				"data": [
						{
								"id": "110",
								"code": "1857005",
								"display": "Gestational rubella syndrome"
						}
				]
		}
		
		Keterangan :
			Data yang harus ditambahkan pada API ini dapat dilihat pada link ini https://www.hl7.org/fhir/valueset-vaccination-protocol-dose-target.html
		
	e. put
		Method : PUT
		Url format : host:port/{apikey}/vaccination-protocol-dose-target/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/vaccination-protocol-dose-targets/100
		body:
			{
				"code" : "1857005",
				"display" : "Gestational rubella syndrome"
			}
		response : 
		{
				"err_code": 0,
				"err_msg": "Vaccination Protocol Dose Target has been update.",
				"data": [
						{
								"id": "110",
								"code": "1857005",
								"display": "Gestational rubella syndrome"
						}
				]
		}
		
75. vaccination-protocol-dose-status
	a. get all data
		Method : GET 
		Url format : host:port/{apikey}/vaccination-protocol-dose-status
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/vaccination-protocol-dose-status
		
	b. get by id
		Method : GET
		Url format : host:port/{apikey}/vaccination-protocol-dose-status/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/vaccination-protocol-dose-status/130
	
	c. Get data by code
		Method : GET
		Url format : host:port/{apikey}/vaccination-protocol-dose-status/code/{code}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/vaccination-protocol-dose-status/code/count
		
	d. Add 
		Method : POST
		Url format : host:port/{apikey}/vaccination-protocol-dose-status
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/vaccination-protocol-dose-status
		body : 
			{
				"code" : "count",
				"display" : "Counts",
				"definition" : "The dose counts toward fulfilling a path to immunity for a patient, providing protection against the target disease."
				}
		response : 
		{
				"err_code": 0,
				"err_msg": "Vaccination Protocol Dose Status has been add.",
				"data": [
						{
								"id": "100",
								"code": "count",
								"display": "Counts",
								"definition": "The dose counts toward fulfilling a path to immunity for a patient, providing protection against the target disease."
						}
				]
		}
		
		Keterangan :
			Data yang harus ditambahkan pada API ini dapat dilihat pada link ini https://www.hl7.org/fhir/valueset-vaccination-protocol-dose-status.html
			
	e. put
		Method : PUT
		Url format : host:port/{apikey}/vaccination-protocol-dose-status/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/vaccination-protocol-dose-status/100
		body:
			{
				"code" : "count",
				"display" : "Counts",
				"definition" : "The dose counts toward fulfilling a path to immunity for a patient, providing protection against the target disease."
			}
		response : 
		{
				"err_code": 0,
				"err_msg": "Vaccination Protocol Dose Status has been update.",
				"data": [
						{
								"id": "100",
								"code": "count",
								"display": "Counts",
								"definition": "The dose counts toward fulfilling a path to immunity for a patient, providing protection against the target disease."
						}
				]
		}
		
76. vaccination-protocol-dose-status-reason
	a. get all data
		Method : GET 
		Url format : host:port/{apikey}/vaccination-protocol-dose-status-reason
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/vaccination-protocol-dose-status-reason
		
	b. get by id
		Method : GET
		Url format : host:port/{apikey}/vaccination-protocol-dose-status-reason/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/vaccination-protocol-dose-status-reason/130
	
	c. Get data by code
		Method : GET
		Url format : host:port/{apikey}/vaccination-protocol-dose-status-reason/code/{code}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/vaccination-protocol-dose-status-reason/code/advstorage
		
	d. Add 
		Method : POST
		Url format : host:port/{apikey}/vaccination-protocol-dose-status-reason
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/vaccination-protocol-dose-status-reason
		body : 
			{
				"code" : "advstorage",
				"display" : "Adverse storage condition",
				"definition" : "The product was stored in a manner inconsistent with manufacturer guidelines potentially reducing the effectiveness of the product."
			}
		response : 
		{
				"err_code": 0,
				"err_msg": "Vaccination Protocol Dose Status Reason has been add.",
				"data": [
						{
								"id": "100",
								"code": "advstorage",
								"display": "Adverse storage condition",
								"definition": "The product was stored in a manner inconsistent with manufacturer guidelines potentially reducing the effectiveness of the product."
						}
				]
		}
		
		Keterangan :
			Data yang harus ditambahkan pada API ini dapat dilihat pada link ini https://www.hl7.org/fhir/valueset-vaccination-protocol-dose-status-reason.html
			
	e. put
		Method : PUT
		Url format : host:port/{apikey}/vaccination-protocol-dose-status-reason/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/vaccination-protocol-dose-status-reason/100
		body:
			{
				"code" : "advstorage",
				"display" : "Adverse storage condition",
				"definition" : "The product was stored in a manner inconsistent with manufacturer guidelines potentially reducing the effectiveness of the product."
			}
		response : 
		{
				"err_code": 0,
				"err_msg": "Vaccination Protocol Dose Status Reason has been update.",
				"data": [
						{
								"id": "100",
								"code": "advstorage",
								"display": "Adverse storage condition",
								"definition": "The product was stored in a manner inconsistent with manufacturer guidelines potentially reducing the effectiveness of the product."
						}
				]
		}
		
77. immunization-recommendation-target-disease
	a. get all data
		Method : GET 
		Url format : host:port/{apikey}/immunization-recommendation-target-disease
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/immunization-recommendation-target-disease
		
	b. get by id
		Method : GET
		Url format : host:port/{apikey}/immunization-recommendation-target-disease/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/immunization-recommendation-target-disease/130
	
	c. Get data by code
		Method : GET
		Url format : host:port/{apikey}/immunization-recommendation-target-disease/code/{code}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/immunization-recommendation-target-disease/code/1857005
		
	d. Add 
		Method : POST
		Url format : host:port/{apikey}/immunization-recommendation-target-disease
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/immunization-recommendation-target-disease
		body : 
			{
				"code" : "1857005",
				"display" : "Gestational rubella syndrome"
			}
		response : 
		{
				"err_code": 0,
				"err_msg": "Immunization Recommendation Target Disease has been add.",
				"data": [
						{
								"id": "100",
								"code": "1857005",
								"display": "Gestational rubella syndrome"
						}
				]
		}
		
		Keterangan :
			Data yang harus ditambahkan pada API ini dapat dilihat pada link ini https://www.hl7.org/fhir/valueset-immunization-recommendation-target-disease.html
		
	e. put
		Method : PUT
		Url format : host:port/{apikey}/immunization-recommendation-target-disease/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/immunization-recommendation-target-disease/100
		body:
			{
				"code" : "1857005",
				"display" : "Gestational rubella syndrome"
			}
		response : 
		{
				"err_code": 0,
				"err_msg": "Immunization Recommendation Target Disease has been update.",
				"data": [
						{
								"id": "100",
								"code": "1857005",
								"display": "Gestational rubella syndrome"
						}
				]
		}
		
78. immunization-recommendation-status
	a. get all data
		Method : GET 
		Url format : host:port/{apikey}/immunization-recommendation-status
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/immunization-recommendation-status
		
	b. get by id
		Method : GET
		Url format : host:port/{apikey}/immunization-recommendation-status/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/immunization-recommendation-status/130
	
	c. Get data by code
		Method : GET
		Url format : host:port/{apikey}/immunization-recommendation-status/code/{code}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/immunization-recommendation-status/code/due
		
	d. Add 
		Method : POST
		Url format : host:port/{apikey}/immunization-recommendation-status
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/immunization-recommendation-status
		body : 
			{
				"code" : "due",
				"display" : "Due",
				"definition" : "The patient is due for their next vaccination."
			}
		response : 
		{
				"err_code": 0,
				"err_msg": "Immunization Recommendation Status has been add.",
				"data": [
						{
								"id": "100",
								"code": "due",
								"display": "Due",
								"definition": "The patient is due for their next vaccination."
						}
				]
		}
		
		Keterangan :
			Data yang harus ditambahkan pada API ini dapat dilihat pada link ini https://www.hl7.org/fhir/valueset-immunization-recommendation-status.html
			
	e. put
		Method : PUT
		Url format : host:port/{apikey}/immunization-recommendation-status/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/immunization-recommendation-status/100
		body:
			{
				"code" : "due",
				"display" : "Due",
				"definition" : "The patient is due for their next vaccination."
			}
		response : 
		{
				"err_code": 0,
				"err_msg": "Vaccination Protocol Dose Status Reason has been update.",
				"data": [
						{
								"id": "100",
								"code": "due",
								"display": "Due",
								"definition": "The patient is due for their next vaccination."
						}
				]
		}
		
79. immunization-recommendation-status
	a. get all data
		Method : GET 
		Url format : host:port/{apikey}/immunization-recommendation-date-criterion
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/immunization-recommendation-date-criterion
		
	b. get by id
		Method : GET
		Url format : host:port/{apikey}/immunization-recommendation-date-criterion/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/immunization-recommendation-date-criterion/130
	
	c. Get data by code
		Method : GET
		Url format : host:port/{apikey}/immunization-recommendation-date-criterion/code/{code}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/immunization-recommendation-date-criterion/code/due
		
	d. Add 
		Method : POST
		Url format : host:port/{apikey}/immunization-recommendation-date-criterion
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/immunization-recommendation-date-criterion
		body : 
			{
				"code" : "due",
				"display" : "Due",
				"definition" : "Date the next dose is considered due."
			}
		response : 
		{
					"err_code": 0,
					"err_msg": "Immunization Recommendation Date Criterion has been add.",
					"data": [
							{
									"id": "100",
									"code": "due",
									"display": "Due",
									"definition": "Date the next dose is considered due."
							}
					]
			}
			
			Keterangan :
			Data yang harus ditambahkan pada API ini dapat dilihat pada link ini https://www.hl7.org/fhir/valueset-immunization-recommendation-date-criterion.html
		
	e. put
		Method : PUT
		Url format : host:port/{apikey}/immunization-recommendation-date-criterion/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/immunization-recommendation-date-criterion/100
		body:
			{
				"code" : "due",
				"display" : "Due",
				"definition" : "Date the next dose is considered due."
			}
		response : 
		{
				"err_code": 0,
				"err_msg": "Immunization Recommendation Date Criterion has been update.",
				"data": [
						{
								"id": "101",
								"code": "undefined",
								"display": "Due",
								"definition": "Date the next dose is considered due."
						}
				]
		}
		
80. medication-status
	a. get all data
		Method : GET 
		Url format : host:port/{apikey}/medication-status
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/medication-status
		
	b. get by id
		Method : GET
		Url format : host:port/{apikey}/medication-status/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/medication-status/130
	
	c. Get data by code
		Method : GET
		Url format : host:port/{apikey}/medication-status/code/{code}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/medication-status/code/active
		
	d. Add 
		Method : POST
		Url format : host:port/{apikey}/medication-status
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/medication-status
		body : 
			{
				"code" : "active",
				"display" : "Active",
				"definition" : "The medication is available for use"
			}
		response : 
		{
				"err_code": 0,
				"err_msg": "Medication Status has been add.",
				"data": [
						{
								"id": "100",
								"code": "active",
								"display": "Active",
								"definition": "The medication is available for use"
						}
				]
		}
		
		Keterangan :
			Data yang harus ditambahkan pada API ini dapat dilihat pada link ini https://www.hl7.org/fhir/valueset-medication-status.html
			
	e. put
		Method : PUT
		Url format : host:port/{apikey}/medication-status/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/medication-status/100
		body:
			{
				"code" : "active",
				"display" : "Active",
				"definition" : "The medication is available for use"
			}
		response : 
		{
				"err_code": 0,
				"err_msg": "Medication Status has been update.",
				"data": [
						{
								"id": "100",
								"code": "active",
								"display": "Active",
								"definition": "The medication is available for use"
						}
				]
		}
		
81. medication-form-codes
	a. get all data
		Method : GET 
		Url format : host:port/{apikey}/medication-form-codes
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/medication-form-codes
		
	b. get by id
		Method : GET
		Url format : host:port/{apikey}/medication-form-codes/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/medication-form-codes/130
	
	c. Get data by code
		Method : GET
		Url format : host:port/{apikey}/medication-form-codes/code/{code}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/medication-form-codes/code/7946007
		
	d. Add 
		Method : POST
		Url format : host:port/{apikey}/medication-form-codes
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/medication-form-codes
		body : 
			{
				"code" : "7946007",
				"display" : "Drug suspension",
				"definition" : ""
			}
		response : 
		{
				"err_code": 0,
				"err_msg": "Medication Form Codes has been add.",
				"data": [
						{
								"id": "100",
								"code": "7946007",
								"display": "Drug suspension",
								"definition": "null"
						}
				]
		}
		
		Keterangan :
			Data yang harus ditambahkan pada API ini dapat dilihat pada link ini https://www.hl7.org/fhir/valueset-medication-form-codes.html
			
	e. put
		Method : PUT
		Url format : host:port/{apikey}/medication-form-codes/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/medication-form-codes/100
		body:
			{
				"code" : "7946007",
				"display" : "Drug suspension",
				"definition" : ""
			}
		response : 
		{
				"err_code": 0,
				"err_msg": "Medication Form Codes has been update.",
				"data": [
						{
								"id": "100",
								"code": "7946007",
								"display": "Drug suspension",
								"definition": "null"
						}
				]
		}
		
82. medication-package-form
	a. get all data
		Method : GET 
		Url format : host:port/{apikey}/medication-package-form
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/medication-package-form
		
	b. get by id
		Method : GET
		Url format : host:port/{apikey}/medication-package-form/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/medication-package-form/130
	
	c. Get data by code
		Method : GET
		Url format : host:port/{apikey}/medication-package-form/code/{code}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/medication-package-form/code/ampoule
		
	d. Add 
		Method : POST
		Url format : host:port/{apikey}/medication-package-form
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/medication-package-form
		body : 
			{
				"code" : "ampoule",
				"display" : "Ampoule",
				"definition" : "A sealed glass capsule containing a liquid"
			}
		response : 
		{
				"err_code": 0,
				"err_msg": "Medication Package Form has been add.",
				"data": [
						{
								"id": "100",
								"code": "ampoule",
								"display": "Ampoule",
								"definition": "A sealed glass capsule containing a liquid"
						}
				]
		}
		
		Keterangan :
			Data yang harus ditambahkan pada API ini dapat dilihat pada link ini https://www.hl7.org/fhir/valueset-medication-package-form.html

	e. put
		Method : PUT
		Url format : host:port/{apikey}/medication-package-form/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/medication-package-form/100
		body:
			{
				"code" : "ampoule",
				"display" : "Ampoule",
				"definition" : "A sealed glass capsule containing a liquid"
			}
		response : 
		{
				"err_code": 0,
				"err_msg": "Medication Package Form has been update.",
				"data": [
						{
								"id": "100",
								"code": "ampoule",
								"display": "Ampoule",
								"definition": "A sealed glass capsule containing a liquid"
						}
				]
		}	
		
		
83. medication-statement-status
	a. get all data
		Method : GET 
		Url format : host:port/{apikey}/medication-statement-status
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/medication-statement-status
		
	b. get by id
		Method : GET
		Url format : host:port/{apikey}/medication-statement-status/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/medication-statement-status/130
	
	c. Get data by code
		Method : GET
		Url format : host:port/{apikey}/medication-statement-status/code/{code}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/medication-statement-status/code/active
		
	d. Add 
		Method : POST
		Url format : host:port/{apikey}/medication-statement-status
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/medication-statement-status
		body : 
			{
				"code" : "active",
				"display" : "Active",
				"definition" : "The medication is still being taken."
			}
			
		response : 
			{
					"err_code": 0,
					"err_msg": "Medication Statement Status has been add.",
					"data": [
							{
									"id": "100",
									"code": "active",
									"display": "Active",
									"definition": "The medication is still being taken."
							}
					]
			}
			
			Keterangan :
			Data yang harus ditambahkan pada API ini dapat dilihat pada link ini https://www.hl7.org/fhir/valueset-medication-statement-status.html

	e. put
		Method : PUT
		Url format : host:port/{apikey}/medication-statement-status/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/medication-statement-status/100
		body:
			{
				"code" : "active",
				"display" : "Active",
				"definition" : "The medication is still being taken."
			}
			
		response : 
			{
					"err_code": 0,
					"err_msg": "Medication Statement Status has been update.",
					"data": [
							{
									"id": "100",
									"code": "active",
									"display": "Active",
									"definition": "The medication is still being taken."
							}
					]
			}		

84. medication-statement-category
	a. get all data
		Method : GET 
		Url format : host:port/{apikey}/medication-statement-category
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/medication-statement-category
		
	b. get by id
		Method : GET
		Url format : host:port/{apikey}/medication-statement-category/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/medication-statement-category/130
	
	c. Get data by code
		Method : GET
		Url format : host:port/{apikey}/medication-statement-category/code/{code}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/medication-statement-category/code/inpatient
		
	d. Add 
		Method : POST
		Url format : host:port/{apikey}/medication-statement-category
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/medication-statement-category
		body : 
			{
				"code" : "inpatient",
				"display" : "Inpatient",
				"definition" : "Includes orders for medications to be administered or consumed in an inpatient or acute care setting"
			}
			
		response : 
			{
					"err_code": 0,
					"err_msg": "Medication Statement Category has been add.",
					"data": [
							{
									"id": "100",
									"code": "inpatient",
									"display": "Inpatient",
									"definition": "Includes orders for medications to be administered or consumed in an inpatient or acute care setting"
							}
					]
			}
			
			Keterangan :
			Data yang harus ditambahkan pada API ini dapat dilihat pada link ini https://www.hl7.org/fhir/valueset-medication-statement-category.html

	e. put
		Method : PUT
		Url format : host:port/{apikey}/medication-statement-category/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/medication-statement-category/100
		body:
			{
				"code" : "inpatient",
				"display" : "Inpatient",
				"definition" : "Includes orders for medications to be administered or consumed in an inpatient or acute care setting"
			}
			
		response : 
			{
					"err_code": 0,
					"err_msg": "Medication Statement Category has been update.",
					"data": [
							{
									"id": "100",
									"code": "inpatient",
									"display": "Inpatient",
									"definition": "Includes orders for medications to be administered or consumed in an inpatient or acute care setting"
							}
					]
			}
		
85. medication-statement-taken
	a. get all data
		Method : GET 
		Url format : host:port/{apikey}/medication-statement-taken
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/medication-statement-taken
		
	b. get by id
		Method : GET
		Url format : host:port/{apikey}/medication-statement-taken/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/medication-statement-taken/130
	
	c. Get data by code
		Method : GET
		Url format : host:port/{apikey}/medication-statement-taken/code/{code}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/medication-statement-taken/code/y
		
	d. Add 
		Method : POST
		Url format : host:port/{apikey}/medication-statement-taken
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/medication-statement-taken
		body : 
			{
				"code" : "y",
				"display" : "Yes",
				"definition" : "Positive assertion that patient has taken medication"
			}
			
		response : 
			{
					"err_code": 0,
					"err_msg": "Medication Statement Taken has been add.",
					"data": [
							{
									"id": "100",
									"code": "y",
									"display": "Yes",
									"definition": "Positive assertion that patient has taken medication"
							}
					]
			}
			
			Keterangan :
			Data yang harus ditambahkan pada API ini dapat dilihat pada link ini https://www.hl7.org/fhir/valueset-medication-statement-taken.html

	e. put
		Method : PUT
		Url format : host:port/{apikey}/medication-statement-taken/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/medication-statement-taken/100
		body:
			{
				"code" : "y",
				"display" : "Yes",
				"definition" : "Positive assertion that patient has taken medication"
			}
			
		response : 
			{
					"err_code": 0,
					"err_msg": "Medication Statement Taken has been update.",
					"data": [
							{
									"id": "100",
									"code": "y",
									"display": "Yes",
									"definition": "Positive assertion that patient has taken medication"
							}
					]
			}
				
86.  reason-medication-not-taken-codes
	a. get all data
		Method : GET 
		Url format : host:port/{apikey}/reason-medication-not-taken-codes
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/reason-medication-not-taken-codes
		
	b. get by id
		Method : GET
		Url format : host:port/{apikey}/reason-medication-not-taken-codes/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/reason-medication-not-taken-codes/130
	
	c. Get data by code
		Method : GET
		Url format : host:port/{apikey}/reason-medication-not-taken-codes/code/{code}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/reason-medication-not-taken-codes/code/182862001
		
	d. Add 
		Method : POST
		Url format : host:port/{apikey}/reason-medication-not-taken-codes
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/reason-medication-not-taken-codes
		body : 
			{
				"code" : "182862001",
				"display" : "Drug not taken - dislike taste",
				"definition" : ""
			}
			
		response : 
			{
					"err_code": 0,
					"err_msg": "Reason Medication Not Taken Codes has been add.",
					"data": [
							{
									"id": "100",
									"code": "182862001",
									"display": "Drug not taken - dislike taste",
									"definition": "null"
							}
					]
			}
			
			Keterangan :
			Data yang harus ditambahkan pada API ini dapat dilihat pada link ini https://www.hl7.org/fhir/valueset-reason-medication-not-taken-codes.html		

	e. put
		Method : PUT
		Url format : host:port/{apikey}/reason-medication-not-taken-codes/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/reason-medication-not-taken-codes/100
		body:
			{
				"code" : "182862001",
				"display" : "Drug not taken - dislike taste",
				"definition" : ""
			}
			
		response : 
			{
					"err_code": 0,
					"err_msg": "Reason Medication Not Taken Codes has been update.",
					"data": [
							{
									"id": "100",
									"code": "182862001",
									"display": "Drug not taken - dislike taste",
									"definition": "null"
							}
					]
			}
								
87. medication-request-status
	a. get all data
		Method : GET 
		Url format : host:port/{apikey}/medication-request-status
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/medication-request-status
		
	b. get by id
		Method : GET
		Url format : host:port/{apikey}/medication-request-status/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/medication-request-status/130
	
	c. Get data by code
		Method : GET
		Url format : host:port/{apikey}/medication-request-status/code/{code}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/medication-request-status/code/active
		
	d. Add 
		Method : POST
		Url format : host:port/{apikey}/medication-request-status
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/medication-request-status
		body : 
			{
				"code" : "active",
				"display" : "Active",
				"definition" : "The prescription is 'actionable', but not all actions that are implied by it have occurred yet."
			}
			
		response : 
			{
					"err_code": 0,
					"err_msg": "Medication Request Status has been add.",
					"data": [
							{
									"id": "100",
									"code": "active",
									"display": "Active",
									"definition": "The prescription is actionable, but not all actions that are implied by it have occurred yet."
							}
					]
			}
			
			Keterangan :
			Data yang harus ditambahkan pada API ini dapat dilihat pada link ini https://www.hl7.org/fhir/valueset-medication-request-status.html
		

	e. put
		Method : PUT
		Url format : host:port/{apikey}/medication-request-status/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/medication-request-status/100
		body:
			{
				"code" : "active",
				"display" : "Active",
				"definition" : "The prescription is 'actionable', but not all actions that are implied by it have occurred yet."
			}
			
		response : 
			{
					"err_code": 0,
					"err_msg": "Medication Request Status has been update.",
					"data": [
							{
									"id": "100",
									"code": "active",
									"display": "Active",
									"definition": "The prescription is actionable, but not all actions that are implied by it have occurred yet."
							}
					]
			}
		
88.   medication-request-intent
	a. get all data
		Method : GET 
		Url format : host:port/{apikey}/medication-request-intent
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/medication-request-intent
		
	b. get by id
		Method : GET
		Url format : host:port/{apikey}/medication-request-intent/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/medication-request-intent/130
	
	c. Get data by code
		Method : GET
		Url format : host:port/{apikey}/medication-request-intent/code/{code}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/medication-request-intent/code/proposal
		
	d. Add 
		Method : POST
		Url format : host:port/{apikey}/medication-request-intent
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/medication-request-intent
		body : 
			{
				"code" : "proposal",
				"display" : "Proposal",
				"definition" : "The request is a suggestion made by someone/something that doesn't have an intention to ensure it occurs and without providing an authorization to act"
			}
			
		response : 
			{
					"err_code": 0,
					"err_msg": "Medication Request Intent has been add.",
					"data": [
							{
									"id": "100",
									"code": "proposal",
									"display": "Proposal",
									"definition": "The request is a suggestion made by someone/something that doesnt have an intention to ensure it occurs and without providing an authorization to act"
							}
					]
			}
			
			Keterangan :
			Data yang harus ditambahkan pada API ini dapat dilihat pada link ini https://www.hl7.org/fhir/valueset-medication-request-intent.html
		

	e. put
		Method : PUT
		Url format : host:port/{apikey}/medication-request-intent/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/medication-request-intent/100
		body:
			{
				"code" : "proposal",
				"display" : "Proposal",
				"definition" : "The request is a suggestion made by someone/something that doesn't have an intention to ensure it occurs and without providing an authorization to act"
			}
			
		response : 
			{
					"err_code": 0,
					"err_msg": "Medication Request Intent has been update.",
					"data": [
							{
									"id": "100",
									"code": "proposal",
									"display": "Proposal",
									"definition": "The request is a suggestion made by someone/something that doesnt have an intention to ensure it occurs and without providing an authorization to act"
							}
					]
			}
		
89.   medication-request-category
	a. get all data
		Method : GET 
		Url format : host:port/{apikey}/medication-request-category
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/medication-request-category
		
	b. get by id
		Method : GET
		Url format : host:port/{apikey}/medication-request-category/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/medication-request-category/130
	
	c. Get data by code
		Method : GET
		Url format : host:port/{apikey}/medication-request-category/code/{code}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/medication-request-category/code/inpatient
		
	d. Add 
		Method : POST
		Url format : host:port/{apikey}/medication-request-category
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/medication-request-category
		body : 
			{
				"code" : "inpatient",
				"display" : "Inpatient",
				"definition" : "Includes orders for medications to be administered or consumed in an inpatient or acute care setting"
			}
			
		response : 
			{
					"err_code": 0,
					"err_msg": "Medication Request Category has been add.",
					"data": [
							{
									"id": "100",
									"code": "inpatient",
									"display": "Inpatient",
									"definition": "Includes orders for medications to be administered or consumed in an inpatient or acute care setting"
							}
					]
			}
			
			Keterangan :
			Data yang harus ditambahkan pada API ini dapat dilihat pada link ini https://www.hl7.org/fhir/valueset-medication-request-category.html
		
	e. put
		Method : PUT
		Url format : host:port/{apikey}/medication-request-category/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/medication-request-category/100
		body:
			{
				"code" : "inpatient",
				"display" : "Inpatient",
				"definition" : "Includes orders for medications to be administered or consumed in an inpatient or acute care setting"
			}
			
		response : 
			{
					"err_code": 0,
					"err_msg": "Medication Request Category has been update.",
					"data": [
							{
									"id": "100",
									"code": "inpatient",
									"display": "Inpatient",
									"definition": "Includes orders for medications to be administered or consumed in an inpatient or acute care setting"
							}
					]
			}
						
90.  medication-request-priority
	a. get all data
		Method : GET 
		Url format : host:port/{apikey}/medication-request-priority
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/medication-request-priority
		
	b. get by id
		Method : GET
		Url format : host:port/{apikey}/medication-request-priority/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/medication-request-priority/130
	
	c. Get data by code
		Method : GET
		Url format : host:port/{apikey}/medication-request-priority/code/{code}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/medication-request-priority/code/ampoule
		
	d. Add 
		Method : POST
		Url format : host:port/{apikey}/medication-request-priority
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/medication-request-priority
		body : 
			{
				"code" : "routine",
				"display" : "Routine",
				"definition" : "The order has a normal priority."
			}
			
		response : 
			{
					"err_code": 0,
					"err_msg": "Medication Request Priority has been add.",
					"data": [
							{
									"id": "100",
									"code": "routine",
									"display": "Routine",
									"definition": "The order has a normal priority."
							}
					]
			}
			
			Keterangan :
			Data yang harus ditambahkan pada API ini dapat dilihat pada link ini https://www.hl7.org/fhir/valueset-medication-request-priority.html
		

	e. put
		Method : PUT
		Url format : host:port/{apikey}/medication-request-priority/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/medication-request-priority/100
		body:
			{
				"code" : "routine",
				"display" : "Routine",
				"definition" : "The order has a normal priority."
			}
			
		response : 
			{
					"err_code": 0,
					"err_msg": "Medication Request Priority has been update.",
					"data": [
							{
									"id": "100",
									"code": "routine",
									"display": "Routine",
									"definition": "The order has a normal priority."
							}
					]
			}
						
91.   medication-codes
	a. get all data
		Method : GET 
		Url format : host:port/{apikey}/medication-codes
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/medication-codes
		
	b. get by id
		Method : GET
		Url format : host:port/{apikey}/medication-codes/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/medication-codes/130
	
	c. Get data by code
		Method : GET
		Url format : host:port/{apikey}/medication-codes/code/{code}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/medication-codes/code/261000
		
	d. Add 
		Method : POST
		Url format : host:port/{apikey}/medication-codes
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/medication-codes
		body : 
			{
				"code" : "261000",
				"display" : "Codeine phosphate",
				"definition" : ""
			}
			
		response : 
			{
					"err_code": 0,
					"err_msg": "Medication Codes has been add.",
					"data": [
							{
									"id": "100",
									"code": "261000",
									"display": "Codeine phosphate",
									"definition": "null"
							}
					]
			}
			
			Keterangan :
			Data yang harus ditambahkan pada API ini dapat dilihat pada link ini https://www.hl7.org/fhir/valueset-medication-codes.html
		

	e. put
		Method : PUT
		Url format : host:port/{apikey}/medication-codes/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/medication-codes/100
		body:
			{
				"code" : "261000",
				"display" : "Codeine phosphate",
				"definition" : ""
			}
			
		response : 
			{
					"err_code": 0,
					"err_msg": "Medication Codes has been update.",
					"data": [
							{
									"id": "100",
									"code": "261000",
									"display": "Codeine phosphate",
									"definition": "null"
							}
					]
			}
						
92.   substance-admin-substitution-reason
	a. get all data
		Method : GET 
		Url format : host:port/{apikey}/substance-admin-substitution-reason
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/substance-admin-substitution-reason
		
	b. get by id
		Method : GET
		Url format : host:port/{apikey}/substance-admin-substitution-reason/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/substance-admin-substitution-reason/130
	
	c. Get data by code
		Method : GET
		Url format : host:port/{apikey}/substance-admin-substitution-reason/code/{code}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/substance-admin-substitution-reason/code/CT
		
	d. Add 
		Method : POST
		Url format : host:port/{apikey}/substance-admin-substitution-reason
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/substance-admin-substitution-reason
		body : 
			{
				"code" : "CT",
				"display" : "continuing therapy",
				"definition" : "Indicates that the decision to substitute or to not substitute was driven by a desire to maintain consistency with a pre-existing therapy. I.e. The performer provided the same item/service as had been previously provided rather than providing exactly what was ordered, or rather than substituting with a lower-cost equivalent."
			}
			
		response : 
			{
					"err_code": 0,
					"err_msg": "Substance Admin Substitution Reason has been add.",
					"data": [
							{
									"id": "100",
									"code": "CT",
									"display": "continuing therapy",
									"definition": "Indicates that the decision to substitute or to not substitute was driven by a desire to maintain consistency with a pre-existing therapy. I.e. The performer provided the same item/service as had been previously provided rather than providing exactly what was ordered, or rather than substituting with a lower-cost equivalent."
							}
					]
			}
			
			Keterangan :
			Data yang harus ditambahkan pada API ini dapat dilihat pada link ini https://www.hl7.org/fhir/v3/SubstanceAdminSubstitutionReason/vs.html
		

	e. put
		Method : PUT
		Url format : host:port/{apikey}/substance-admin-substitution-reason/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/substance-admin-substitution-reason/100
		body:
			{
				"code" : "CT",
				"display" : "continuing therapy",
				"definition" : "Indicates that the decision to substitute or to not substitute was driven by a desire to maintain consistency with a pre-existing therapy. I.e. The performer provided the same item/service as had been previously provided rather than providing exactly what was ordered, or rather than substituting with a lower-cost equivalent."
			}
			
		response : 
			{
					"err_code": 0,
					"err_msg": "Substance Admin Substitution Reason has been update.",
					"data": [
							{
									"id": "100",
									"code": "CT",
									"display": "continuing therapy",
									"definition": "Indicates that the decision to substitute or to not substitute was driven by a desire to maintain consistency with a pre-existing therapy. I.e. The performer provided the same item/service as had been previously provided rather than providing exactly what was ordered, or rather than substituting with a lower-cost equivalent."
							}
					]
			}
						
93. medication-dispense-status
	a. get all data
		Method : GET 
		Url format : host:port/{apikey}/medication-dispense-status
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/medication-dispense-status
		
	b. get by id
		Method : GET
		Url format : host:port/{apikey}/medication-dispense-status/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/medication-dispense-status/130
	
	c. Get data by code
		Method : GET
		Url format : host:port/{apikey}/medication-dispense-status/code/{code}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/medication-dispense-status/code/in-progress
		
	d. Add 
		Method : POST
		Url format : host:port/{apikey}/medication-dispense-status
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/medication-dispense-status
		body : 
			{
				"code" : "in-progress",
				"display" : "In Progress",
				"definition" : "The dispense has started but has not yet completed."
			}
			
		response : 
			{
					"err_code": 0,
					"err_msg": "Medication Dispense Status has been add.",
					"data": [
							{
									"id": "100",
									"code": "in-progress",
									"display": "In Progress",
									"definition": "The dispense has started but has not yet completed."
							}
					]
			}
			
			Keterangan :
			Data yang harus ditambahkan pada API ini dapat dilihat pada link ini https://www.hl7.org/fhir/valueset-medication-dispense-status.html
		

	e. put
		Method : PUT
		Url format : host:port/{apikey}/medication-dispense-status/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/medication-dispense-status/100
		body:
			{
				"code" : "in-progress",
				"display" : "In Progress",
				"definition" : "The dispense has started but has not yet completed."
			}
			
		response : 
			{
					"err_code": 0,
					"err_msg": "Medication Dispense Status has been update.",
					"data": [
							{
									"id": "100",
									"code": "in-progress",
									"display": "In Progress",
									"definition": "The dispense has started but has not yet completed."
							}
					]
			}
		
94. medication-dispense-category
	a. get all data
		Method : GET 
		Url format : host:port/{apikey}/medication-dispense-category
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/medication-dispense-category
		
	b. get by id
		Method : GET
		Url format : host:port/{apikey}/medication-dispense-category/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/medication-dispense-category/130
	
	c. Get data by code
		Method : GET
		Url format : host:port/{apikey}/medication-dispense-category/code/{code}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/medication-dispense-category/code/inpatient
		
	d. Add 
		Method : POST
		Url format : host:port/{apikey}/medication-dispense-category
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/medication-dispense-category
		body : 
			{
				"code" : "inpatient",
				"display" : "Inpatient",
				"definition" : "Includes dispenses for medications to be administered or consumed in an inpatient or acute care setting"
			}
			
		response : 
			{
					"err_code": 0,
					"err_msg": "Medication Dispense Category has been add.",
					"data": [
							{
									"id": "100",
									"code": "inpatient",
									"display": "Inpatient",
									"definition": "Includes dispenses for medications to be administered or consumed in an inpatient or acute care setting"
							}
					]
			}
			
			Keterangan :
			Data yang harus ditambahkan pada API ini dapat dilihat pada link ini https://www.hl7.org/fhir/valueset-medication-dispense-category.html
		

	e. put
		Method : PUT
		Url format : host:port/{apikey}/medication-dispense-category/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/medication-dispense-category/100
		body:
			{
				"code" : "inpatient",
				"display" : "Inpatient",
				"definition" : "Includes dispenses for medications to be administered or consumed in an inpatient or acute care setting"
			}
			
		response : 
			{
					"err_code": 0,
					"err_msg": "Medication Dispense Category has been update.",
					"data": [
							{
									"id": "100",
									"code": "inpatient",
									"display": "Inpatient",
									"definition": "Includes dispenses for medications to be administered or consumed in an inpatient or acute care setting"
							}
					]
			}	

95.  act-pharmacy-supply-type
	a. get all data
		Method : GET 
		Url format : host:port/{apikey}/act-pharmacy-supply-type
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/act-pharmacy-supply-type
		
	b. get by id
		Method : GET
		Url format : host:port/{apikey}/act-pharmacy-supply-type/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/act-pharmacy-supply-type/130
	
	c. Get data by code
		Method : GET
		Url format : host:port/{apikey}/act-pharmacy-supply-type/code/{code}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/act-pharmacy-supply-type/code/DF
		
	d. Add 
		Method : POST
		Url format : host:port/{apikey}/act-pharmacy-supply-type
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/act-pharmacy-supply-type
		body : 
			{
				"code" : "DF",
				"display" : "Daily Fill",
				"definition" : "A fill providing sufficient supply for one day"
			}
			
		response : 
			{
					"err_code": 0,
					"err_msg": "Act Pharmacy Supply Type has been add.",
					"data": [
							{
									"id": "100",
									"code": "DF",
									"display": "Daily Fill",
									"definition": "A fill providing sufficient supply for one day"
							}
					]
			}
			
			Keterangan :
			Data yang harus ditambahkan pada API ini dapat dilihat pada link ini https://www.hl7.org/fhir/v3/ActPharmacySupplyType/vs.html
		
	e. put
		Method : PUT
		Url format : host:port/{apikey}/act-pharmacy-supply-type/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/act-pharmacy-supply-type/100
		body:
			{
				"code" : "DF",
				"display" : "Daily Fill",
				"definition" : "A fill providing sufficient supply for one day"
			}
			
		response : 
			{
					"err_code": 0,
					"err_msg": "Act Pharmacy Supply Type has been update.",
					"data": [
							{
									"id": "100",
									"code": "DF",
									"display": "Daily Fill",
									"definition": "A fill providing sufficient supply for one day"
							}
					]
			}
		
96. act-substance-admin-substitution-code
	a. get all data
		Method : GET 
		Url format : host:port/{apikey}/act-substance-admin-substitution-code
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/act-substance-admin-substitution-code
		
	b. get by id
		Method : GET
		Url format : host:port/{apikey}/act-substance-admin-substitution-code/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/act-substance-admin-substitution-code/130
	
	c. Get data by code
		Method : GET
		Url format : host:port/{apikey}/act-substance-admin-substitution-code/code/{code}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/act-substance-admin-substitution-code/code/ampoule
		
	d. Add 
		Method : POST
		Url format : host:port/{apikey}/act-substance-admin-substitution-code
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/act-substance-admin-substitution-code
		body : 
			{
				"code" : "E",
				"display" : "equivalent",
				"definition" : "Description: Substitution occurred or is permitted with another bioequivalent and therapeutically equivalent product."
			}
			
		response : 
			{
					"err_code": 0,
					"err_msg": "Act Substance Admin Substitution Code has been add.",
					"data": [
							{
									"id": "100",
									"code": "E",
									"display": "equivalent",
									"definition": "Description Substitution occurred or is permitted with another bioequivalent and therapeutically equivalent product."
							}
					]
			}
			
			Keterangan :
			Data yang harus ditambahkan pada API ini dapat dilihat pada link ini https://www.hl7.org/fhir/v3/ActSubstanceAdminSubstitutionCode/vs.html
		

	e. put
		Method : PUT
		Url format : host:port/{apikey}/act-substance-admin-substitution-code/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/act-substance-admin-substitution-code/100
		body:
			{
				"code" : "E",
				"display" : "equivalent",
				"definition" : "Description: Substitution occurred or is permitted with another bioequivalent and therapeutically equivalent product."
			}	
			
		response : 
			{
					"err_code": 0,
					"err_msg": "Act Substance Admin Substitution Code has been update.",
					"data": [
							{
									"id": "100",
									"code": "E",
									"display": "equivalent",
									"definition": "Description Substitution occurred or is permitted with another bioequivalent and therapeutically equivalent product."
							}
					]
			}

97.  act-substance-admin-substitution-reason
	a. get all data
		Method : GET 
		Url format : host:port/{apikey}/act-substance-admin-substitution-reason
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/act-substance-admin-substitution-reason
		
	b. get by id
		Method : GET
		Url format : host:port/{apikey}/act-substance-admin-substitution-reason/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/act-substance-admin-substitution-reason/130
	
	c. Get data by code
		Method : GET
		Url format : host:port/{apikey}/act-substance-admin-substitution-reason/code/{code}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/act-substance-admin-substitution-reason/code/ampoule
		
	d. Add 
		Method : POST
		Url format : host:port/{apikey}/act-substance-admin-substitution-reason
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/act-substance-admin-substitution-reason
		body : 
			{
				"code" : "CT",
				"display" : "continuing therapy",
				"definition" : "Indicates that the decision to substitute or to not substitute was driven by a desire to maintain consistency with a pre-existing therapy. I.e. The performer provided the same item/service as had been previously provided rather than providing exactly what was ordered, or rather than substituting with a lower-cost equivalent."
			}
			
		response : 
			{
					"err_code": 0,
					"err_msg": "Act Substance Admin Substitution Reason has been add.",
					"data": [
							{
									"id": "100",
									"code": "CT",
									"display": "continuing therapy",
									"definition": "Indicates that the decision to substitute or to not substitute was driven by a desire to maintain consistency with a pre-existing therapy. I.e. The performer provided the same item/service as had been previously provided rather than providing exactly what was ordered, or rather than substituting with a lower-cost equivalent."
							}
					]
			}
			
			Keterangan :
			Data yang harus ditambahkan pada API ini dapat dilihat pada link ini https://www.hl7.org/fhir/v3/SubstanceAdminSubstitutionReason/vs.html

	e. put
		Method : PUT
		Url format : host:port/{apikey}/act-substance-admin-substitution-reason/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/act-substance-admin-substitution-reason/100
		body:
			{
				"code" : "CT",
				"display" : "continuing therapy",
				"definition" : "Indicates that the decision to substitute or to not substitute was driven by a desire to maintain consistency with a pre-existing therapy. I.e. The performer provided the same item/service as had been previously provided rather than providing exactly what was ordered, or rather than substituting with a lower-cost equivalent."
			}
			
		response : 
			{
					"err_code": 0,
					"err_msg": "Act Substance Admin Substitution Reason has been update.",
					"data": [
							{
									"id": "100",
									"code": "CT",
									"display": "continuing therapy",
									"definition": "Indicates that the decision to substitute or to not substitute was driven by a desire to maintain consistency with a pre-existing therapy. I.e. The performer provided the same item/service as had been previously provided rather than providing exactly what was ordered, or rather than substituting with a lower-cost equivalent."
							}
					]
			}

98.   medication-admin-status
	a. get all data
		Method : GET 
		Url format : host:port/{apikey}/medication-admin-status
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/medication-admin-status
		
	b. get by id
		Method : GET
		Url format : host:port/{apikey}/medication-admin-status/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/medication-admin-status/130
	
	c. Get data by code
		Method : GET
		Url format : host:port/{apikey}/medication-admin-status/code/{code}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/medication-admin-status/code/ampoule
		
	d. Add 
		Method : POST
		Url format : host:port/{apikey}/medication-admin-status
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/medication-admin-status
		body : 
			{
				"code" : "in-progress",
				"display" : "In Progress",
				"definition" : "The administration has started but has not yet completed."
			}
			
		response : 
			{
					"err_code": 0,
					"err_msg": "Medication Admin Status has been add.",
					"data": [
							{
									"id": "100",
									"code": "in-progress",
									"display": "In Progress",
									"definition": "The administration has started but has not yet completed."
							}
					]
			}
			
			Keterangan :
			Data yang harus ditambahkan pada API ini dapat dilihat pada link ini https://www.hl7.org/fhir/valueset-medication-admin-status.html
		

	e. put
		Method : PUT
		Url format : host:port/{apikey}/medication-admin-status/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/medication-admin-status/100
		body:
			{
				"code" : "in-progress",
				"display" : "In Progress",
				"definition" : "The administration has started but has not yet completed."
			}
			
		response : 
			{
					"err_code": 0,
					"err_msg": "Medication Admin Status has been update.",
					"data": [
							{
									"id": "100",
									"code": "in-progress",
									"display": "In Progress",
									"definition": "The administration has started but has not yet completed."
							}
					]
			}

99.   medication-admin-category
	a. get all data
		Method : GET 
		Url format : host:port/{apikey}/medication-admin-category
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/medication-admin-category
		
	b. get by id
		Method : GET
		Url format : host:port/{apikey}/medication-admin-category/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/medication-admin-category/130
	
	c. Get data by code
		Method : GET
		Url format : host:port/{apikey}/medication-admin-category/code/{code}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/medication-admin-category/code/ampoule
		
	d. Add 
		Method : POST
		Url format : host:port/{apikey}/medication-admin-category
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/medication-admin-category
		body : 
			{
				"code" : "inpatient",
				"display" : "Inpatient",
				"definition" : "Includes administrations in an inpatient or acute care setting"
			}
			
		response : 
			{
					"err_code": 0,
					"err_msg": "Medication Admin Category has been add.",
					"data": [
							{
									"id": "100",
									"code": "inpatient",
									"display": "Inpatient",
									"definition": "Includes administrations in an inpatient or acute care setting"
							}
					]
			}
			
			Keterangan :
			Data yang harus ditambahkan pada API ini dapat dilihat pada link ini https://www.hl7.org/fhir/valueset-medication-admin-category.html
		

	e. put
		Method : PUT
		Url format : host:port/{apikey}/medication-admin-category/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/medication-admin-category/100
		body:
			{
				"code" : "inpatient",
				"display" : "Inpatient",
				"definition" : "Includes administrations in an inpatient or acute care setting"
			}
			
		response : 
			{
					"err_code": 0,
					"err_msg": "Medication Category has been update.",
					"data": [
							{
									"id": "100",
									"code": "inpatient",
									"display": "Inpatient",
									"definition": "Includes administrations in an inpatient or acute care setting"
							}
					]
			}													
																
100.  reason-medication-not-given-codes
	a. get all data
		Method : GET 
		Url format : host:port/{apikey}/reason-medication-not-given-codes
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/reason-medication-not-given-codes
		
	b. get by id
		Method : GET
		Url format : host:port/{apikey}/reason-medication-not-given-codes/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/reason-medication-not-given-codes/130
	
	c. Get data by code
		Method : GET
		Url format : host:port/{apikey}/reason-medication-not-given-codes/code/{code}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/reason-medication-not-given-codes/code/134396000
		
	d. Add 
		Method : POST
		Url format : host:port/{apikey}/reason-medication-not-given-codes
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/reason-medication-not-given-codes
		body : 
			{
				"code" : "134396000",
				"display" : "Statin declined",
				"definition" : ""
			}
			
		response : 
			{
					"err_code": 0,
					"err_msg": "Reason Medication Not Given Codes has been add.",
					"data": [
							{
									"id": "100",
									"code": "134396000",
									"display": "Statin declined",
									"definition": "null"
							}
					]
			}
			
			Keterangan :
			Data yang harus ditambahkan pada API ini dapat dilihat pada link ini https://www.hl7.org/fhir/valueset-reason-medication-not-given-codes.html
		

	e. put
		Method : PUT
		Url format : host:port/{apikey}/reason-medication-not-given-codes/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/reason-medication-not-given-codes/100
		body:
			{
				"code" : "134396000",
				"display" : "Statin declined",
				"definition" : ""
			}
			
		response : 
			{
					"err_code": 0,
					"err_msg": "Reason Medication Not Given Codes has been update.",
					"data": [
							{
									"id": "100",
									"code": "134396000",
									"display": "Statin declined",
									"definition": "null"
							}
					]
			}
																																
101.  reason-medication-given-codes
	a. get all data
		Method : GET 
		Url format : host:port/{apikey}/reason-medication-given-codes
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/reason-medication-given-codes
		
	b. get by id
		Method : GET
		Url format : host:port/{apikey}/reason-medication-given-codes/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/reason-medication-given-codes/130
	
	c. Get data by code
		Method : GET
		Url format : host:port/{apikey}/reason-medication-given-codes/code/{code}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/reason-medication-given-codes/code/a
		
	d. Add 
		Method : POST
		Url format : host:port/{apikey}/reason-medication-given-codes
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/reason-medication-given-codes
		body : 
			{
				"code" : "a",
				"display" : "None",
				"definition" : "No reason known."
			}
			
		response : 
			{
					"err_code": 0,
					"err_msg": "Reason Medication Given Codes has been add.",
					"data": [
							{
									"id": "100",
									"code": "a",
									"display": "None",
									"definition": "No reason known."
							}
					]
			}
			
			Keterangan :
			Data yang harus ditambahkan pada API ini dapat dilihat pada link ini https://www.hl7.org/fhir/valueset-reason-medication-given-codes.html

	e. put
		Method : PUT
		Url format : host:port/{apikey}/reason-medication-given-codes/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/reason-medication-given-codes/100
		body:
			{
				"code" : "a",
				"display" : "None",
				"definition" : "No reason known."
			}
			
		response : 
			{
					"err_code": 0,
					"err_msg": "Reason Medication Given Codes has been update.",
					"data": [
							{
									"id": "100",
									"code": "a",
									"display": "None",
									"definition": "No reason known."
							}
					]
			}							
102.  approach-site-codes
	a. get all data
		Method : GET 
		Url format : host:port/{apikey}/approach-site-codes
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/approach-site-codes
		
	b. get by id
		Method : GET
		Url format : host:port/{apikey}/approach-site-codes/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/approach-site-codes/130
	
	c. Get data by code
		Method : GET
		Url format : host:port/{apikey}/approach-site-codes/code/{code}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/approach-site-codes/code/106004
		
	d. Add 
		Method : POST
		Url format : host:port/{apikey}/approach-site-codes
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/approach-site-codes
		body : 
			{
				"code" : "106004",
				"display" : "Posterior carpal region",
				"definition" : ""
			}

		response : 
			{
					"err_code": 0,
					"err_msg": "Approach Site Codes has been add.",
					"data": [
							{
									"id": "100",
									"code": "106004",
									"display": "Posterior carpal region",
									"definition": "null"
							}
					]
			}
			
			Keterangan :
			Data yang harus ditambahkan pada API ini dapat dilihat pada link ini https://www.hl7.org/fhir/valueset-approach-site-codes.html
		

	e. put
		Method : PUT
		Url format : host:port/{apikey}/approach-site-codes/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/approach-site-codes/100
		body:
			{
				"code" : "106004",
				"display" : "Posterior carpal region",
				"definition" : ""
			}
			
		response : 
			{
					"err_code": 0,
					"err_msg": "Approach Site Codes has been update.",
					"data": [
							{
									"id": "100",
									"code": "106004",
									"display": "Posterior carpal region",
									"definition": "null"
							}
					]
			}
										
103.  administration-method-codes
	a. get all data
		Method : GET 
		Url format : host:port/{apikey}/administration-method-codes
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/administration-method-codes
		
	b. get by id
		Method : GET
		Url format : host:port/{apikey}/administration-method-codes/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/administration-method-codes/130
	
	c. Get data by code
		Method : GET
		Url format : host:port/{apikey}/administration-method-codes/code/{code}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/administration-method-codes/code/417924000
		
	d. Add 
		Method : POST
		Url format : host:port/{apikey}/administration-method-codes
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/administration-method-codes
		body : 
			{
				"code" : "417924000",
				"display" : "Apply",
				"definition" : ""
			}
			
		response : 
			{
					"err_code": 0,
					"err_msg": "Administration Method Codes has been add.",
					"data": [
							{
									"id": "100",
									"code": "417924000",
									"display": "Apply",
									"definition": "null"
							}
					]
			}
			
			Keterangan :
			Data yang harus ditambahkan pada API ini dapat dilihat pada link ini https://www.hl7.org/fhir/valueset-administration-method-codes.html
		

	e. put
		Method : PUT
		Url format : host:port/{apikey}/administration-method-codes/{id}
		example : 192.168.1.90:2008/21494c4a05f01c2d4309b420e6387f4c/administration-method-codes/100
		body:
			{
				"code" : "417924000",
				"display" : "Apply",
				"definition" : ""
			}
			
		response : 
			{
					"err_code": 0,
					"err_msg": "Administration Method Codes has been update.",
					"data": [
							{
									"id": "100",
									"code": "417924000",
									"display": "Apply",
									"definition": "null"
							}
					]
			}
										