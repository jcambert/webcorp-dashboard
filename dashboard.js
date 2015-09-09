


(function(angular){
'use strict';	 
var dashboard=angular.module('webcorp.dashboard',_.union(webcorp.dependencies.dependencies || [],['ui.router', 'webcorp.core','webcorp.ui.menu','webcorp.ui.header','webcorp.ui.widget','webcorp.ui.table']));

dashboard.config(['$logProvider','$stateProvider', '$urlRouterProvider','$wviewProvider',function($log,$stateProvider, $urlRouterProvider,$wview){
	$log.debugEnabled(false);
	console.dir($wview);
	console.dir($log);
	console.dir(dashboard);
	$urlRouterProvider.otherwise("/");
	$stateProvider
    .state('home', {
      url: '/',
	 views:{
		  'pagehead':{templateUrl: function(){ return $wview.head('dashboard');},controller:function(){}},
		  'pagecontent':{templateUrl: function(){return $wview.content('dashboard');},controller:function(){}}
	  }
    })
	/*.state('chiffrage', {
      url: '/chiffrage',
	 views:{
		  'pagehead':{templateUrl: function(){ return $wview.head('chiffrage','index');},controller:function(){}},
		  'pagecontent':{templateUrl: function(){return $wview.content('chiffrage','index');},controller:function(){}}
	  }
    })*/
	;
	
	console.log('Application configurated');
}]);

dashboard.value('DefaultTemplateRoot','directives/templates/');
dashboard.value('DefaultPartialsRoot','partials');


dashboard.run(['$rootScope', '$log','$state','$templateCache', '$config','$menus','DefaultTemplateRoot','DefaultPartialsRoot',function($rootScope,$log,$state,$templateCache,$config,$menus,$defaultTplRoot,$defaultPartialsRoot){
	
	$log.log('Application starting');
	
	$config.set('TemplateRoot',$defaultTplRoot);
	
	$rootScope.$menus=$menus;
	
	var menus=[
		{groupId:null,itemId:'menu0',options:{position:0,label:'Accueil',route:'home',icon:'tachometer'}},
		
		
		];
	//$menus.add(null,'menu0',{label:'label0',route:'route_label0',icon:'tachometer'}).add(null,'menu1',{label:'label1',route:'route_label1',icon:'list-alt',isGroup:true,tooltip:'tooltip menu1'}).add('menu1','menu2',{label:'label2',route:'route_label2'}).add('menu1','menu3',{label:'label3',route:'route_label3'});
	$rootScope.$menus.add(menus);
	
	$rootScope.menus=$menus.menus();
	$rootScope.menuPosition='side';
	
	$rootScope.$on('$stateNotFound', 
		function(event, unfoundState, fromState, fromParams){ 
			console.log('******* STATE NOT FOUND ****************');
			console.log(unfoundState.to); 
			console.log(unfoundState.toParams); 
			console.log(unfoundState.options);
		});
	$rootScope.$on('$stateChangeError', 
		function(event, toState, toParams, fromState, fromParams, error){
			console.log('******* STATE CHANGE ERROR ****************');
			console.log(toState); 
		});
	$rootScope.$on('$stateChangeSuccess', 
		function(event, toState, toParams, fromState, fromParams){ 
			console.log('******* STATE CHANGE SUCCESS ****************');
			console.log('From:' + fromState.name + ' to '+ toState.name);
			
			$log.log('Clear Cache for development');
			$templateCache.removeAll();
		 });
	/* TODO REMOVE FOR PRODUCTION*/
	 $rootScope.$on('$viewContentLoaded', 
		 function() {
			$log.log('Clear Cache for development');
			$templateCache.removeAll();
		});
	
	$state.go('home');
	
}]);

dashboard.controller('dashboardctrl',['$scope','$log','$menus',function($scope,$log,$menus){

	
	
	

}]);

dashboard.controller('testWidgetCtrl',['$scope',function($scope){
	$scope.wconfig=function($event){
		alert('config');
	};
	$scope.wrefresh=function($event){
		alert('Refresh');
	};
}])
dashboard.directive('dashboard',[function(){
	return{
		restrict:'E',
		replace:true,
		transclude:true,
		template:'<div class="dashboard" data-ng-transclude></div>'
	};
}]);

dashboard.directive('myDirective',[function(){
	return {
		restrict:'E',
		replace:true,
		transclude:true,
		template:'<div ng-transclude/>'
	}
}]);
}(angular));