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