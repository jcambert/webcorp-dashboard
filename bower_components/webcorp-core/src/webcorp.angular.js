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
		view=angular.isDefined(view)?folder+'/'+view:folder; 
		return $defaultPartialsRoot + view.toLowerCase() + '.'+$defaultHeadSuffix+'.html';
	};
	this.content = function(folder,view){
		view=angular.isDefined(view)?folder+'/'+view:folder; 
		return $defaultPartialsRoot+ view.toLowerCase() + '.'+$defaultContentSuffix+'.html';
	}
	
	this.$get=function(){return{};};

})
;