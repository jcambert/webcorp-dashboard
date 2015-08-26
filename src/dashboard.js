'use strict';

	 
var dashboard=angular.module('webcorp.dashboard',['webcorp.core']);
dashboard.config(['$logProvider',function($log){
	$log.debugEnabled(false);
	console.log('Application configurated');
}]);

dashboard.run(['$rootScope','$log','configService',function($rootScope,$log,$config){
	
	$log.log('Application running');
	$rootScope.config=$config;
	$config.set('TemplateRoot','directives/templates/');
}]);

dashboard.controller('testctrl',['$log','Menus',function($log,$menus){
	$log.log('testctrl starting');
	$menus.add(null,'menu0',{label:'label0'}).add(null,'menu1',{label:'label1',isGroup:true}).add('menu1','menu2',{label:'label2'});
	$log.log('Menu');
	$log.log($menus.menus());
	$log.log('testctrl running');
}]);

dashboard.directive('dashboard',[function(){
	return{
		restrict:'E',
		replace:true,
		transclude:true,
		template:'<div class="dashboard" data-ng-transclude></div>'
	};
}]);

dashboard.directive('menus',['$compile','Menus','configService',function($compile,$menus,$config){
	return {
		restrict:'E',
		replace:true,
		templateUrl:function(elem,attrs){
			return $config.get('TemplateRoot','/directives/templates/')+'menus.tpl.html';
		}
		/*link:function($scope,$element,$attrs){
			//$element.append($config.get('TemplateRoot','test'));
			var tpl=$config.get('TemplateRoot','/directives/templates/')+'menus.tpl.html';
			var content=angular.element('<div></div>');
			$compile(content)($scope);
		}*/
	};
}])

dashboard.service('Roles',['$log',function($log){
	var self={};
	
	var roles=['admin','user','guest'];
	self.roles=roles;
	self.isAuthorized = function(role,value){
		var irole = _.findIndex(self.roles,function(r){ return r===role;});
		var ivalue = _.findIndex(self.roles,function(r){ return r===value;});
		
		return irole<=ivalue;
	};
	
	return self;
}]);
dashboard.service('Menus',['$log','Roles',function($log,$roles){
	var self={};
	self.roles=$roles.roles;
	var menus=[];
	self.defaultRoles=['user'];
	 /*
	 [{id:'group0','label':'label0',roles:[]
	 	items:[
		 {id:'menu0',label:'label0',route:'route0'},
		 {id:'menu1',label:'label1',route:'route1'},
		 {id:'menu2',label:'label2',
		 	items:[
			 	{id:'menu3',label:'label3',route:'route3'}
			 ]
		 }
	 	]
	 }]
	 */
	 var exist = function(id){
	 	$log.log('----- START EXIST ------');  
		var result = find(id);
		$log.log('Exist find:'+result);
		$log.log('----- END EXIST ------');
		 return result!='';
	 }
	 
	 var findMenu = function(menus,id){
			$log.log('----- FIND INDEX ------');  
		 	$log.log('findIndex menus:'+id);$log.log(menus);
			 if(menus.length==0)return '';
			 for(var i=0;i<menus.length;i++){
			 	var menu=menus[i];
				$log.log('current menu:'+i);
			 	$log.log(menus[i]);
			 	$log.log('findIndex:'+menu.id+':'+id);
				var result= (menu.id==id);
				$log.log('result:'+result);
				if(result) return menu;
				if(Array.isArray(menu.items)){
					 $log.log('search in subitems');
				 	return findMenu(menu.items);
				 }else{
					 $log.log(menu);
					 $log.log('menu has no subitems');
				 }
				 
			 }
			 return '';
	 }	 
	 var find = function(id){
			/* return _.filter(menus,function(menu){
				$log.log('findIndex:'+menu.id+':'+id);
			 	var result= (menu.id==id);	
			 	$log.log('result:'+result);
			 	if(result) return true;
			 	if(Array.isArray(menu.items)){
					 $log.log('search in subitems');
				 	return findIndex(menu.items);
				 }	
			 	return false;	
			 });*/
		 
		 return findMenu(menus,id);
	 };
	 
	 // A private function for rendering decision
	 //@see https://github.com/meanjs/mean/blob/master/modules/core/client/services/menus.client.service.js
    var shouldRender = function (user) {
		return true;
	}
	
	
	
	
	
	self.add = function(groupId,itemId,options){
		$log.log('****************************************' );
		$log.log('Try Adding Menu:'+itemId + ' to ' + groupId);
		if(exist(itemId))return self;
		
		options = options || {};
		
		var builder = function(){
			var result= {
				id:itemId,
				label: options.label || itemId,
				roles: options.roles || self.defaultRoles,
				title: options.title || '',
				state: options.state || '',
				class: options.class || '',
				icon:  options.icon  || '',
				position: options.position || 0,
				route: options.route || '',
				shouldRender:shouldRender
			};
			if(options.isGroup)
				result.items=[];
			return result;
		}
		var group=(groupId!=null?find(groupId).items:menus);

		group.push( builder() );

		$log.log('Menus Add');
		$log.log(menus);
		return self;
	};
	
	self.remove = function(id){
		var removeIndex = function(menus){
			 return _.remove(menus,function(menu){
			 	var result= (menu.id===id);	
			 	if(result) return true;
			 	if(Array.isArray(menu.items))
				 	return removeIndex(menu.items);	
			 	return false;	
			 });
		 };
		 menus= removeIndex(menus);
		 return self;
	};
	
	self.enable = function(id){
		if(!exist(id))return self;
	};
	
	self.disable = function(id){
		if(!exist(id))return self;
	};
	
	self.menus = function(){
		return menus;
	};
	
	return self;
}]);
	 
