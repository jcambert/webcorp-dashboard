
'use strict';
angular.module('webcorp.ui.menu',[])
.service('Roles',['$log',function($log){
	var self={};
	
	var roles=['admin','user','guest'];
	self.roles=roles;
	self.isAuthorized = function(role,value){
		var irole = _.findIndex(self.roles,function(r){ return r===role;});
		var ivalue = _.findIndex(self.roles,function(r){ return r===value;});
		
		return irole<=ivalue;
	};
	
	return self;
}])
.directive('menu',['$menu',function($menu){/*'DefaultTemplateRoot','Menus','configService',function($defaultTplRoot,$menus,$config){*/
	return new $menu('menu',{});
	/*return {
		restrict:'E',
		replace:true,
		templateUrl:function(elem,attrs){
			return $config.get('TemplateRoot',$defaultTplRoot)+'menus.tpl.html';
		}
	};*/
}])

.provider('$menu',function(){
	
	// The default options menus
	  var defaultOptions = {
	    placement: 'left',
	    animation: true
	  };
	  
	 // The options specified to the provider globally.
  	var globalOptions = {};
	  
	this.options = function(value) {
		angular.extend(globalOptions, value);
	};
	
	 	/**
	   * This is a helper function for translating camel-case to snake-case.
	   */
	  function snake_case(name) {
	    var regexp = /[A-Z]/g;
	    var separator = '-';
	    return name.replace(regexp, function(letter, pos) {
	      return (pos ? separator : '') + letter.toLowerCase();
	    });
	  }
	this.$get = ['$log','$document', '$interpolate','$compile','$menus',function($log,$document,$interpolate,$compile,$menus){
		return function $menu(type,options){
			options = angular.extend({}, defaultOptions, globalOptions, options);
		 	var directiveName = snake_case(type);
		 	var startSym = $interpolate.startSymbol();
			var endSym = $interpolate.endSymbol();
			
			
			
			return {
				restrict:'E',
				replace:true,
				link:function link($scope,$element,attrs,menuCtrl){
					var template=angular.element('<ul class="menu"></ul>');
					_.forEach($menus.menus(),function(element,index) {
						$log.log('for each menu')
						template.append('<li class="maintab" id="maintab-'+element.id+'" data-submenu="'+index+'"><a href="#" ui-sref="" class="title"></a></li>');
						var a=template.append();
						if(element.icon)
							template.find('a:last').append('<i class="fa fa-'+element.icon+'"></i>');
						template.find('a:last').append('<span>'+element.label+'</span>');
						if(element.items){
							var tpl1=angular.element('<ul class="submenu" style="top:0px;"></ul>');
							_.forEach(element.items,function(item){
								tpl1.append('<li id='+ item .id +'><a href="#" ui-sref="">' +item.label + '</li>')
							});
							template.find('a:last').append(tpl1);
						}
					}, this);
					$log.log('link menu');
					var linker = $compile(template);
					$element.append(linker($scope));
					$log.log(linker($scope));
					
				}
			};
		};	
	}];
	
})

.service('$menus',['$log','Roles',function($log,$roles){
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
		 return findMenu(menus,id);
	 };
	 
	 // A private function for rendering decision
	 //@see https://github.com/meanjs/mean/blob/master/modules/core/client/services/menus.client.service.js
    var shouldRender = function (user) {
		return true;
	}
	
	
	
	var builder = function(itemId,options){
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
	
	self.add = function(groupId,itemId,options){
		$log.log('****************************************' );
		$log.log('Try Adding Menu:'+itemId + ' to ' + groupId);
		if(exist(itemId))return self;
		
		options = options || {};
		
		
		var group=(groupId!=null?find(groupId).items:menus);

		group.push( builder(itemId,options) );

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