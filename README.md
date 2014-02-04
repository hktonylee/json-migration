json-config
===========

`JSONConfig` is a JSON config reader. You can write migration plan and read old config easily.

Example
-------

Config Version 1 (`user.json`)

```json
{
    "id": 5,
    "full_name": "Harmony Kim",
    "age": 26,
}
```

Config Version 2 (`user-v2.json`)

```json
{
    "id": "5",
    "version": 2,
    "first_name": "Harmony",
    "last_name": "Kim",
    "age": 26
}
```

Config Version 3 (`user-v3.json`)

```json
{
    "id": "5",
    "version": 3,
    "first_name": "Harmony",
    "last_name": "Kim",
    "email": "some@email.com"
}
```


Migration Plan `migration.js`

```javascript
[
    {
        from: null,
        to: {version: 2},
        mapping: {
            "id": T.Convert("id", "string"),
            "first_name": T.Rename("full_name"),
            "last_name": null
        }
    },
    {
        from: {version: 2},
        to: {version: 3},
        mapping: {
            "email": null,    // for old config, set to null as default value
            "age": T.Drop(),  // remove the key-value pair
        }
    }
]
```

Then you can load the config in latest format no matter what version the config is.

```objectivec
// Objective-C
NSDictionary *userConfig = [JCReader dictionaryWithJSONPath:[NSBundle pathForResource:"user" ofType:@"json"] 
                                          migrationPlanPath:[NSBundle pathForResource:"migration" ofType:@"js"]];
```

Features
========

* It supports default value for newly added key-value pair.

    ```javascript
    {
        from: {"version": 2},
        to: {"version": 3},
        mapping: {
            "new_key": "any default value you like"
        }
    }
    ```
   
* It supports inline transformation in Javascript.

	```javascript
	{
        from: {"version": 2},
        to: {"version": 3},
        mapping: {
            "new_name": function (o) {
            	return "name_" + o.toUpperCase();
            }
        }
    }
    ```

* It supports array migration.

	```js
	{
        from: {"version": 2},
        to: {"version": 3},
        mapping: {
            "emails": T.Convert("email", "array")
        }
    }
    ```

* You can add `version` field in later version. So that you can use this library on older projects.

	```javascript
	{
        from: null,
        to: {"version": 3},
        mapping: {
            // ...
        }
    }
    ```

* You can use different method to determine the version.

	```javascript
	{
        from: {"v": "2"},
        to: {"version": 3}
    }
    ```

	or even...
	
	```javascript
	{
		from: {"v1": function (json) { return "full_name" in json; },
		to: {"version": 2}
	}
	```

* Multilingual ;-)

	```objectivec
	// Objective-C
	NSDictionary *newJSONConfig = [JCReader dictionaryWithJSONPath:[NSBundle pathForResource:"user" ofType:@"json"] 
	                                             migrationPlanPath:[NSBundle pathForResource:"migration" ofType:@"js"]];
	```

	```javascript
	// Javascript
	var newJSON = JCReader.read(oldJSONContent, migrationPlan);
	```


* It supports identity transform (do nothing).

	```javascript
	{
        from: {"version": 2},
        to: {"version": 3},
    }
    ```

* It can prevent the new config from inheriting old value.

	```javascript
	{
		from: {"version": 2},
        to: {"version": 3},
        inheritItems: false,   // default: true
        mapping: {
            // ...
        }
    }
    ```

* It supports nested array migration.

	Old version config
	```json
	[
		{
			"name": "Thomas",
			"borrowed_movie_list": [
				{
					"id": 5311,
					"name": "500 Days of Summer"
				},
				{
					"id": 8812,
					"name": "Inception"
				}
			]
		}
	]
	```
	
	New version config
	```json
	[
		{
			"name": "Thomas",
			"borrowed_items": [
				{
					"id": 5311,
					"title": "500 Days of Summer",
					"type": "movie"
				},
				{
					"id": 8812,
					"title": "Inception"
					"type": "movie"
				}
			]
		}
	]
	```
	
	```javascript
	// migration.js
	{
		from: {"version": 2},
        to: {"version": 3},
        mapping: {
            "*.borrowed_items": T.Rename("*.borrowed_movie_list", {
            	"*.type": "movie",
            	"*.title": T.Rename("*.name")
            })
        }
    }
    ```
    
    It is equivalent to this migration script:
    ```javascript
	// migration-2.js
	{
		from: {"version": 2},
        to: {"version": 3},
        mapping: {
        	"*.borrowed_items": T.Rename("*.borrowed_movie_list"),
            "*.borrowed_items.*.type": "movie",
           	"*.borrowed_items.*.title": T.Rename("*.borrowed_items.*.name")
        }
    }
    ```

Design
======

- TODO: ///

What's next
===========

- implement everything ;-)






