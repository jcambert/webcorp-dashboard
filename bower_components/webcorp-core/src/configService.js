webcorp.define('webcorp.ConfigService',function(){
	var self={};
	webcorp.Config = webcorp.Config || {};
	self.get = function (key, defaultValue) {

        var value = webcorp.Config[key];

        if (_.isUndefined(value) && !_.isUndefined(defaultValue)) {
            return defaultValue;
        }

        return value;
    };
	
	self.set = function (key, value) {
        if (!webcorp.Config) {
            webcorp.Config =  {};
        }

        webcorp.Config[key] = value;
    };

    return self;
});