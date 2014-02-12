json-reader
===========

`JSONReader` is a JSON reader. You can write migration plan and read old json easily. So that you may use it to read old json config, NoSQL or whatever.

Example
-------

JSON Version 1 (`user.json`)

```json
{
    "id": 5,
    "full_name": "Harmony Kim",
    "age": 26,
}
```

JSON Version 2 (`user-v2.json`)

```json
{
    "id": "5",
    "first_name": "Harmony Kim",
    "last_name": null,
    "age": 26
}
```

JSON Version 3 (`user-v3.json`)

```json
{
    "id": "5",
    "first_name": "Harmony",
    "last_name": "Kim",
    "email": null
}
```


Migration Plan `migration.js`

```javascript
[
    {
        from: null,
        to: {version: 2},
        mappings: {
            "id": T.Convert("id", "string"),
            "first_name": T.Rename("full_name"),
            "last_name": null
        }
    },
    {
        from: {version: 2},
        to: {version: 3},
        mappings: {
            "email": null,    // for old json, set to null as default value
            "age": T.Drop()   // remove the key-value pair
        }
    }
]
```

Then you can load the json in latest format no matter what version the json is.

```objectivec
// (Objective-C) Code that loads version 1 of the json.
NSDictionary *userJSON = [JSReader dictionaryWithJSONPath:[NSBundle pathForResource:"user" ofType:@"json"] 
                                        migrationPlanPath:[NSBundle pathForResource:"migration" ofType:@"js"]];
                                          
// What you read...
{
	"id": "5",
    "first_name": "Harmony Kim",
    "last_name": null,
    "email": null
}
```

Features
========

* It supports default value for newly added key-value pair.

    ```javascript
    {
        from: {"version": 2},
        to: {"version": 3},
        mappings: {
            "new_key": "any default value you like"
        }
    }
    ```
   
* It supports inline transformation in Javascript.

	```javascript
	{
        from: {"version": 2},
        to: {"version": 3},
        mappings: {
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
        mappings: {
            "emails": T.Convert("email", "array")
        }
    }
    ```

* You can add `version` field in later version. So that you can use this library on older projects.

	```javascript
	{
        from: null,
        to: {"version": 3},
        mappings: {
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
	NSDictionary *newJSON = [JSReader dictionaryWithJSONPath:[NSBundle pathForResource:"user" ofType:@"json"] 
	                                       migrationPlanPath:[NSBundle pathForResource:"migration" ofType:@"js"]];
	```

	```javascript
	// Javascript
	var newJSON = JSReader.read(oldJSONContent, migrationPlan);
	```


* It supports identity transform (do nothing).

	```javascript
	{
        from: {"version": 2},
        to: {"version": 3},
    }
    ```

* It can prevent the new json from inheriting old value.

	```javascript
	{
		from: {"version": 2},
        to: {"version": 3},
        inheritItems: false,   // default: true
        mappings: {
            // ...
        }
    }
    ```

* It supports nested array migration.

	Old version JSON
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
	
	New version JSON
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
        mappings: {
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
        mappings: {
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






