

function jcOK(oldJSONContent, migrationPlan, expectedNewJSONContent) {
    var actualResult = JCReader.read(oldJSONContent, migrationPlan);

    // console.log("Expected", expectedNewJSONContent);
    // console.log("Actual", actualResult);

    QUnit.deepEqual(actualResult, expectedNewJSONContent);
}


///////////////////////////////////////////////////////////////////////////////
test("Example 1.1", function () {
    var oldJSONContent = {
        "id": 5,
        "full_name": "Harmony Kim",
        "age": 26
    };

    var migrationPlan = {
        mappings: {
            "id": T.Convert("id", "string"),
            "first_name": T.Rename("full_name"),
            "last_name": null
        }
    };

    var expectedNewJSONContent = {
        "id": "5",
        "first_name": "Harmony Kim",
        "last_name": null,
        "age": 26
    };

    jcOK(oldJSONContent, migrationPlan, expectedNewJSONContent);
});


///////////////////////////////////////////////////////////////////////////////
test("Example 1.2", function () {
    var oldJSONContent = {
        "id": 5,
        "full_name": "Harmony Kim",
        "age": 26
    };

    var migrationPlan = {
        mappings: {
            "email": null,
            "age": T.Drop(),
            "full_name": T.Drop(),
            "first_name": function (oldJSON) {
                console.log(oldJSON);
                var oldName = oldJSON["full_name"];
                var lastSpace = oldName.lastIndexOf(" ");
                return oldName.substr(0, lastSpace);
            },
            "last_name": function (oldJSON) {
                var oldName = oldJSON["full_name"];
                var lastSpace = oldName.lastIndexOf(" ");
                return oldName.substr(lastSpace + 1);
            }
        }
    };

    var expectedNewJSONContent = {
        "id": 5,
        "first_name": "Harmony",
        "last_name": "Kim",
        "email": null
    };

    jcOK(oldJSONContent, migrationPlan, expectedNewJSONContent);
});






