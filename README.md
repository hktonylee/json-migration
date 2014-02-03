json-config
===========

`JSONConfig` is a JSON config reader. You can write migration plan and read old config easily..

Example
-------

Config Version 1 (`user.json`)

	{
	    "id": 5,
	    "name": "Harmony Kim",
	    "age": 26,
	}

Config Version 2 (`user-v2.json`)

	{
	    "id": "5",
	    "version": 2,
	    "first_name": "Harmony",
	    "last_name": "Kim",
	    "age": 26
	}

Config Version 3 (`user-v3.json`)

	{
	    "id": "5",
	    "version": 3,
	    "first_name": "Harmony",
	    "last_name": "Kim",
	    "email": "some@email.com"
	}


Migration Plan `migration.js`

	[
	    {
	        from: null,
	        to: {version: 2},
	        mapping: {
	            "id": ToString("id"),
	            "first_name": CutFirstName(),
	            "last_name": CutLastName()
	        }
	    },
	    {
	        from: {version: 2},
	        to: {version: 3},
	        mapping: {
	            "email": null,
	            "age": DropField(),
	        }
	    }
	]

Then you can load the config in latest format no matter what version the config is.

	NSDictionary *userConfig = [JCReader dictionaryWithJSONPath:[NSBundle pathForResource:"user" ofType:@"json"] 
	                                          migrationPlanPath:[NSBundle pathForResource:"migration" ofType:@"js"]];




TODO
====

- implement everything ;-)