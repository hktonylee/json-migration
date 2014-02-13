

var T = {
    Convert: function (oldKey, newType) {
        return function (oldJSON, newJSON, newKey) {
            if (newType === "string") {
                return String(oldJSON[oldKey]);
            }
        };
    },

    Rename: function (oldKey) {
        return function (oldJSON, newJSON, newKey) {
            var val = newJSON[oldKey];
            delete newJSON[oldKey];
            return val;
        };
    },

    Drop: function() {
        return function (oldJSON, newJSON, newKey) {
            delete newJSON[newKey];
        }
    }
};



var JSReader = (function () {

    var Utility = {
        "clone": function (obj) {
            // Source: http://stackoverflow.com/questions/728360/most-elegant-way-to-clone-a-javascript-object
            if (null == obj || "object" != typeof obj) return obj;

            // Handle Date
            if (obj instanceof Date) {
                var copy = new Date();
                copy.setTime(obj.getTime());
                return copy;
            }

            // Handle Array
            if (obj instanceof Array) {
                var copy = [];
                for (var i = 0, len = obj.length; i < len; i++) {
                    copy[i] = clone(obj[i]);
                }
                return copy;
            }

            // Handle Object
            if (obj instanceof Object) {
                var copy = {};
                for (var attr in obj) {
                    if (obj.hasOwnProperty(attr)) copy[attr] = Utility.clone(obj[attr]);
                }
                return copy;
            }

            throw new Error("Unable to copy obj! Its type isn't supported.");
        },

        "fastHash": function (key, value) {
            key = key.replace("~", "~~");
            var type = typeof value;
            if (type === "number") {
                return key + "~n" + value;
            } else if (type === "string") {
                return key + "~s" + value.replace(",", "~~");
            } else {
                throw "Version value should be either number or string.";
            }
        }
    };


    function JSMigrator (from, to, mappings) {
        this._mappings = mappings;
    };

    JSMigrator.prototype.migrate = function(oldJSONContent) {
        var newJSONContent = Utility.clone(oldJSONContent);
        for (var newKey in this._mappings) {
            var mappingRule = this._mappings[newKey];
            var mappingRuleType = typeof mappingRule;
            if (mappingRuleType === "function") {
                var val = mappingRule(oldJSONContent, newJSONContent, newKey);
                if (typeof val !== "undefined") {
                    newJSONContent[newKey] = val;
                }
            } else {
                newJSONContent[newKey] = mappingRule;
            }
        }
        return newJSONContent;
    };

    return {
        'read': function (oldJSONContent, migrationPlan, targetVersion) {

            var mappings = (typeof migrationPlan === "array"
                            ? migrationPlan[0].mappings
                            : migrationPlan.mappings);

            var migrator = new JSMigrator(null, null, mappings);
            return migrator.migrate(oldJSONContent, targetVersion);
        }
    };

})();




