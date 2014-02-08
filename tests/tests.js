

function jcOK(oldJSONContent, migrationPlan, expectedNewJSONContent) {
    var actualResult = JCReader.read(oldJSONContent, migrationPlan);

    console.log("Expected", expectedNewJSONContent);
    console.log("Actual", actualResult);

    QUnit.deepEqual(actualResult, expectedNewJSONContent);
}


test("simpleMigration1", function () {
    var oldJSONContent = {
        "id": 5,
        "full_name": "Harmony Kim",
        "age": 26
    };

    var migrationPlan = [
        {
            from: null,
            to: {version: 2},
            mappings: {
                "id": T.Convert("id", "string"),
                "first_name": T.Rename("full_name"),
                "last_name": null
            }
        }
    ];

    var expectedNewJSONContent = {
        "id": "5",
        // "version": 2,
        "first_name": "Harmony Kim",
        "last_name": null,
        "age": 26
    };

    jcOK(oldJSONContent, migrationPlan, expectedNewJSONContent);
});



