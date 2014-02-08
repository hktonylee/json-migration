

var T = {
    Convert: function (oldKey, newType) {
        return function (oldJSON, newJSON, newKey) {
            if (newType === "string") {
                newJSON[newKey] = String(oldJSON[oldKey]);
            }
        };
    },

    Rename: function (oldKey) {
        return function (oldJSON, newJSON, newKey) {
            newJSON[newKey] = newJSON[oldKey];
            delete newJSON[oldKey];
        };
    }
};



var JCReader = (function () {

    function JCMigrator (mappings) {
        this._mappings = mappings;
    };

    JCMigrator.prototype.migrate = function(oldJSONContent) {
        var newJSONContent = oldJSONContent;
        for (var newKey in this._mappings) {
            var mappingRule = this._mappings[newKey];
            var mappingRuleType = typeof mappingRule;
            if (mappingRuleType === "function") {
                mappingRule(oldJSONContent, newJSONContent, newKey);
            } else {
                newJSONContent[newKey] = mappingRule;
            }
        }
        return newJSONContent;
    };

    return {
        'read': function (oldJSONContent, migrationPlan) {
            var migrator = new JCMigrator(migrationPlan[0].mappings);
            return migrator.migrate(oldJSONContent);
        }
    };

})();




