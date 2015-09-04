

'use strict';
(function(angular){
	 
var dashboard=angular.module('webcorp.dashboard',['ui.router', 'webcorp.core','webcorp.ui.menu','webcorp.ui.header','webcorp.ui.widget']);
dashboard.provider('$wview',function $wviewProvider(){
	
	var $defaultPartialsRoot='partials/';
	this.setPartialsRoot=function(path){
		$defaultPartialsRoot=path;
	};
	this.head=function(folder,view){
		view=angular.isDefined(view)?folder+'/'+view:folder; 
		return $defaultPartialsRoot + view.toLowerCase() + '.head.html';
	};
	this.content = function(folder,view){
		view=angular.isDefined(view)?folder+'/'+view:folder; 
		return $defaultPartialsRoot+ view.toLowerCase() + '.content.html';
	}
	
	this.$get=function(){return{};};
	/*this.$get=function(){
		
		return {
			head:function(view){
				alert('toto');
				return self.$defaultPartialsRoot + view.toLowerCase() + '.head.html';
			},
			content:function(view){
				return self.$defaultPartialsRoot+ view.toLowerCase() + '.content.html';
			}
		}
	}*/
});
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
	.state('chiffrage', {
      url: '/chiffrage',
	 views:{
		  'pagehead':{templateUrl: function(){ return $wview.head('chiffrage','index');},controller:function(){}},
		  'pagecontent':{templateUrl: function(){return $wview.content('chiffrage','index');},controller:function(){}}
	  }
    })
	;
	
	console.log('Application configurated');
}]);

dashboard.value('DefaultTemplateRoot','directives/templates/');
dashboard.value('DefaultPartialsRoot','partials');


dashboard.run(['$rootScope', '$log','$state','$config','DefaultTemplateRoot','DefaultPartialsRoot',function($rootScope,$log,$state,$config,$defaultTplRoot,$defaultPartialsRoot){
	
	$log.log('Application running');
	
	
	$config.set('TemplateRoot',$defaultTplRoot);
	
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
		 })
	//$config.set('TemplateRoot','directives/temp/');
	$state.go('home');
	
}]);
/*
dashboard.factory('$view',['$config','DefaultPartialsRoot',function($config,$defaultPartialsRoot){
	var result={};
	result.head=function(view){
		return $config.get('PartialsRoot',$defaultPartialsRoot) + view.toLowerCase() + '.head.html';
	};
	result.content=function(view){
		return $config.get('PartialsRoot',$defaultPartialsRoot) + view.toLowerCase() + '.content.html';
	};
	return result;
	
}]);*/



dashboard.controller('testctrl',['$scope','$log','$menus',function($scope,$log,$menus){

	var menus=[
		{groupId:null,itemId:'menu0',options:{label:'Accueil',route:'home',icon:'tachometer'}},
		{groupId:null,itemId:'menu1',options:{label:'Chiffrage',route:'chiffrage',icon:'eur',isGroup:true,tooltip:'Gestion des chiffrage'}},
		{groupId:null,itemId:'menu2',options:{label:'Production',route:'production',icon:'eur',isGroup:true,tooltip:'Gestion de production'}},
		{groupId:null,itemId:'menu3',options:{label:'Production',route:'production',icon:'eur',isGroup:true,tooltip:'Gestion de production'}},
		
		{groupId:'menu2',itemId:'menu10',options:{label:'Creer',route:'chiffrage'}},
		
		];
	//$menus.add(null,'menu0',{label:'label0',route:'route_label0',icon:'tachometer'}).add(null,'menu1',{label:'label1',route:'route_label1',icon:'list-alt',isGroup:true,tooltip:'tooltip menu1'}).add('menu1','menu2',{label:'label2',route:'route_label2'}).add('menu1','menu3',{label:'label3',route:'route_label3'});
	$menus.add(menus);
	
	$scope.menus=$menus.menus();
	$scope.menuPosition='side';
	$scope.toggleMenuPosition=function(){
		$scope.menuPosition=$scope.menuPosition=='top'?'side':'top';
	}
	

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