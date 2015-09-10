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
webcorp.define('webcorp.DependencyService',function(){
	var self={};
	self.dependencies=[];
	
	self.add=function(dep){
		self.dependencies.push(dep);
	}
	
	return self;
	
});

webcorp.dependencies= new webcorp.DependencyService ();
angular.module('webcorp.core',[])
.factory('$config', function () {
    return new webcorp.ConfigService();
})
.factory('locationService', function () {
    return new webcorp.LocationService ();
})
.service('$template',['$log', '$http','$templateCache','$q', '$config',function($log,$http,$templateCache,$q, $config){

	var self=this;
	self.get = function(name){
		return $config.get('TemplateRoot','directives/templates/')+name+'.tpl.html';
	};
	self.load=function(name){
		$log.log('Load template:'+name);
		var tpl=$templateCache.get(this.get(name));
		if(tpl){
			$log.log('from cache')
			$log.log(tpl);
			return $q.when(tpl);	
		}else{
			$log.log('from http');
			var deffered=$q.defer();
			
			$http.get(self.get(name),{cache:true})
				.success(function(response){
					$templateCache.put(self.get(name),response);
					deffered.resolve(response);
				})
				.error(function(response){
					deffered.reject(response);
				})
				;
			
			return deffered.promise;
			
		}
		
	}
}])


.provider('$wview',function $wviewProvider(){
	
	var $defaultPartialsRoot='partials/';
	var $defaultHeadSuffix='head';
	var $defaultContentSuffix='content';
	this.setPartialsRoot=function(path){
		$defaultPartialsRoot=path;
	};
	
	this.setDefaultHeadSuffix=function(suffix){
		$defaultHeadSuffix=suffix;
	}
	
	this.setDefaultContentSuffix=function(suffix){
		$defaultContentSuffix=suffix;
	}
	this.head=function(folder,view){
		view=angular.isDefined(view)?folder.replace('.','/')+'/'+view:folder; 
		return $defaultPartialsRoot + view.toLowerCase() + '.'+$defaultHeadSuffix+'.html';
	};
	this.content = function(folder,view){
		view=angular.isDefined(view)?folder.replace('.','/')+'/'+view:folder; 
		return $defaultPartialsRoot+ view.toLowerCase() + '.'+$defaultContentSuffix+'.html';
	}
	
	this.$get=function(){return{};};

})
;