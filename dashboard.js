

'use strict';
(function(angular){
	 
var dashboard=angular.module('webcorp.dashboard',['webcorp.core','webcorp.ui.menu']);
dashboard.config(['$logProvider',function($log){
	$log.debugEnabled(false);
	console.log('Application configurated');
}]);

dashboard.value('DefaultTemplateRoot','directives/templates/');

dashboard.run(['$log','configService','DefaultTemplateRoot',function($log,$config,$defaultTplRoot){
	
	$log.log('Application running');
	
	$config.set('TemplateRoot',$defaultTplRoot);
	//$config.set('TemplateRoot','directives/temp/');
}]);

dashboard.controller('testctrl',['$scope','$log','$menus',function($scope,$log,$menus){

	$menus.add(null,'menu0',{label:'label0',route:'route_label0',icon:'tachometer'}).add(null,'menu1',{label:'label1',route:'route_label1',icon:'list-alt',isGroup:true}).add('menu1','menu2',{label:'label2',route:'route_label2'}).add('menu1','menu3',{label:'label3',route:'route_label3'});
	
	
	$scope.menus=$menus.menus();
}]);

dashboard.directive('dashboard',[function(){
	return{
		restrict:'E',
		replace:true,
		transclude:true,
		template:'<div class="dashboard" data-ng-transclude></div>'
	};
}]);

}(angular));