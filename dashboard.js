

'use strict';
(function(angular){
	 
var dashboard=angular.module('webcorp.dashboard',['ui.router', 'webcorp.core','webcorp.ui.menu','webcorp.ui.header','webcorp.ui.widget']);
dashboard.config(['$logProvider','$stateProvider', '$urlRouterProvider','$viewProvider',function($log,$stateProvider, $urlRouterProvider,$view){
	$log.debugEnabled(false);
	
	$urlRouterProvider.otherwise("/");
	$stateProvider
    .state('home', {
      url: "/",
	  views:{
		  "page_head":{templateUrl: function(){return $view.head('dashboard');},controller:function(){}},
		  "page_content":{templateUrl: function(){return $view.content('dashboard');},controller:function(){}}
	  }
      
    })
	
	;
	
	console.log('Application configurated');
}]);

dashboard.value('DefaultTemplateRoot','directives/templates/');
dashboard.value('DefaultPartialsRoot','partials');
dashboard.run(['$log','$config','DefaultTemplateRoot','DefaultPartialsRoot',function($log,$config,$defaultTplRoot,$defaultPartialsRoot){
	
	$log.log('Application running');
	
	
	$config.set('TemplateRoot',$defaultTplRoot);
	
	//$config.set('TemplateRoot','directives/temp/');
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

dashboard.provider('$viewProvider',function $viewProvider(){
	var self=this;
	self.$defaultPartialsRoot='partials/';
	self.setPartialsRoot=function(path){
		self.$defaultPartialsRoot=path;
	}
	self.$get=function(){
		
		return {
			head:function(view){
				return self.$defaultPartialsRoot + view.toLowerCase() + '.head.html';
			},
			content:function(view){
				return self.$defaultPartialsRoot+ view.toLowerCase() + '.content.html';
			}
		}
	}
});

dashboard.controller('testctrl',['$scope','$log','$menus',function($scope,$log,$menus){

	var menus=[
		{groupId:null,itemId:'menu0',options:{label:'label0',route:'route_label0',icon:'tachometer'}},
		{groupId:null,itemId:'menu1',options:{label:'Chiffrage',route:'chiffrage',icon:'eur',isGroup:true,tooltip:'Gestion des chiffrage'}},
		{groupId:'menu1',itemId:'chiffrage_create',options:{label:'Creer',route:'chiffrage.create'}},
		{groupId:'menu1',itemId:'menu3',options:{label:'label3',route:'route_label3'}},
		//{groupId:null,itemId:'menu4',options:{label:'Chiffrage',route:'chiffrage',icon:'eur',isGroup:true,tooltip:'Gestion des chiffrage'}},
		//{groupId:'menu4',itemId:'menu5',options:{label:'Creer',route:'chiffrage_new'}}
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

}(angular));