'use strict';
var wc = window.wc = {};
var webcorp = window.webcorp = wc;
//var _=require('lodash');
webcorp.namespace = function (namespaceString) {
    var parts = namespaceString.split('.'), parent = webcorp, i;

    //strip redundant leading global
    if (parts[0] === 'wc' || parts[0] === 'webcorp') {
        parts = parts.slice(1);
    }

    var targetParent = webcorp,
        targetName;

    for (i = 0; i < parts.length; i++) {
        //create a propery if it doesn't exist
        if (typeof parent[parts[i]] === 'undefined') {
            parent[parts[i]] = {};
        }

        if (i === parts.length - 2) {
            targetParent = parent[parts[i]];
        }

        targetName = parts[i];

        parent = parent[parts[i]];
    }

    return {
        targetParent: targetParent,
        targetName: targetName,
        bind: function (target) {
            targetParent[targetName] = target;
        }
    };
};

webcorp.define = function (namespace, fn) {
    webcorp.namespace(namespace).bind(fn);
};


webcorp.define('webcorp.LocationService', function () {

    return {

        path: function () {
            return window.location.href;
        }
    };
});
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
angular.module('webcorp.core',[])
.factory('$config', function () {
    return new webcorp.ConfigService();
})
.factory('locationService', function () {
    return new webcorp.LocationService ();
})
.service('$template',['$config',function($config){
    this.get = function(name){
        return $config.get('TemplateRoot','directives/templates/')+name+'.tpl.html';
    }
}])
;