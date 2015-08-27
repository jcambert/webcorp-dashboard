'use strict';

	 
var dashboard=angular.module('webcorp.dashboard',['webcorp.core']);
dashboard.config(['angular.elementlogProvider',function(angular.elementlog){
	angular.elementlog.debugEnabled(false);
	console.log('Application configurated');
}]);

dashboard.value('DefaultTemplateRoot','directives/templates/');

dashboard.run(['angular.elementlog','configService','DefaultTemplateRoot',function(angular.elementlog,angular.elementconfig,angular.elementdefaultTplRoot){
	
	angular.elementlog.log('Application running');
	
	angular.elementconfig.set('TemplateRoot',angular.elementdefaultTplRoot);
}]);

dashboard.controller('testctrl',['angular.elementscope','angular.elementlog','Menus',function(angular.elementscope,angular.elementlog,angular.elementmenus){
	angular.elementlog.log('testctrl starting');
	angular.elementmenus.add(null,'menu0',{label:'label0',route:'route_label0',icon:'tachometer'}).add(null,'menu1',{label:'label1',route:'route_label1',icon:'list-alt',isGroup:true}).add('menu1','menu2',{label:'label2',route:'route_label2'});
	angular.elementlog.log('Menu');
	angular.elementlog.log(angular.elementmenus.menus());
	angular.elementlog.log('testctrl running');
	
	angular.elementscope.menus=angular.elementmenus.menus();
}]);

dashboard.directive('dashboard',[function(){
	return{
		restrict:'E',
		replace:true,
		transclude:true,
		template:'<div class="dashboard" data-ng-transclude></div>'
	};
}]);

dashboard.directive('menus',['DefaultTemplateRoot','Menus','configService',function(angular.elementdefaultTplRoot,angular.elementmenus,angular.elementconfig){
	return {
		restrict:'E',
		replace:true,
		templateUrl:function(elem,attrs){
			return angular.elementconfig.get('TemplateRoot',angular.elementdefaultTplRoot)+'menus.tpl.html';
		}
	};
}])

dashboard.service('Roles',['angular.elementlog',function(angular.elementlog){
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
dashboard.service('Menus',['angular.elementlog','Roles',function(angular.elementlog,angular.elementroles){
	var self={};
	self.roles=angular.elementroles.roles;
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
	 	angular.elementlog.log('----- START EXIST ------');  
		var result = find(id);
		angular.elementlog.log('Exist find:'+result);
		angular.elementlog.log('----- END EXIST ------');
		 return result!='';
	 }
	 
	 var findMenu = function(menus,id){
			angular.elementlog.log('----- FIND INDEX ------');  
		 	angular.elementlog.log('findIndex menus:'+id);angular.elementlog.log(menus);
			 if(menus.length==0)return '';
			 for(var i=0;i<menus.length;i++){
			 	var menu=menus[i];
				angular.elementlog.log('current menu:'+i);
			 	angular.elementlog.log(menus[i]);
			 	angular.elementlog.log('findIndex:'+menu.id+':'+id);
				var result= (menu.id==id);
				angular.elementlog.log('result:'+result);
				if(result) return menu;
				if(Array.isArray(menu.items)){
					 angular.elementlog.log('search in subitems');
				 	return findMenu(menu.items);
				 }else{
					 angular.elementlog.log(menu);
					 angular.elementlog.log('menu has no subitems');
				 }
				 
			 }
			 return '';
	 }	 
	 var find = function(id){
			/* return _.filter(menus,function(menu){
				angular.elementlog.log('findIndex:'+menu.id+':'+id);
			 	var result= (menu.id==id);	
			 	angular.elementlog.log('result:'+result);
			 	if(result) return true;
			 	if(Array.isArray(menu.items)){
					 angular.elementlog.log('search in subitems');
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
		angular.elementlog.log('****************************************' );
		angular.elementlog.log('Try Adding Menu:'+itemId + ' to ' + groupId);
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

		angular.elementlog.log('Menus Add');
		angular.elementlog.log(menus);
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
	 
angular.element(document).ready(function () {
	//set main navigation aside
	/* global employee_token */
	function navSidebar(){
		var sidebar = angular.element('#nav-sidebar');
		sidebar.off();
		angular.element('.expanded').removeClass('expanded');
		angular.element('.maintab').not('.active').closest('.submenu').hide();
		sidebar.on('click','.submenu_expand', function(){
			var angular.elementnavId = angular.element(this).parent();
			angular.element('.submenu-collapse').remove();
			if(angular.element('.expanded').length ){
				angular.element('.expanded > ul').slideUp('fast', function(){
					var angular.elementtarget = angular.element('.expanded');
					angular.elementtarget.removeClass('expanded');
					angular.element(angular.elementnavId).not(angular.elementtarget).not('.active').addClass('expanded');
					angular.element(angular.elementnavId).not(angular.elementtarget).not('.active').children('ul:first').hide().slideDown();
				});
			}
			else {
				angular.element(angular.elementnavId).not('.active').addClass('expanded');
				angular.element(angular.elementnavId).not('.active').children('ul:first').hide().slideDown();
			}
		});
		//sidebar menu collapse
		sidebar.find('.menu-collapse').on('click',function(){
			angular.element(this).toggleClass('icon-rotate-90');

			if (angular.element(this).hasClass('icon-rotate-90')) {
				angular.element(this).css('margin-left', '5px');
				angular.element('.page-head .page-title').css('padding-left', '70px');
				angular.element('.page-head .breadcrumb').css('left', '70px');
				angular.element('.page-head .page-subtitle').css('left', '70px');

			} else {
				angular.element(this).css('margin-left', '');
				angular.element('.page-head .page-title').css('padding-left', '230px');
				angular.element('.page-head .breadcrumb').css('left', '230px');
				angular.element('.page-head .page-subtitle').css('left', '230px');
			}

			angular.element('body').toggleClass('page-sidebar-closed');
			angular.element('.expanded').removeClass('expanded');
			angular.element.ajax({
				url: "index.php",
				cache: false,
				data: "token="+employee_token+'&ajax=1&action=toggleMenu&tab=AdminEmployees&collapse='+Number(angular.element('body').hasClass('page-sidebar-closed'))
			});
		});

		var menuCollapse = sidebar.find('.menu-collapse');

		if (angular.element('body').hasClass('page-sidebar-closed')) {
			menuCollapse.addClass('icon-rotate-90');
			menuCollapse.css('margin-left', '5px');
			angular.element('.page-head .page-title').css('padding-left', '70px');
			angular.element('.page-head .breadcrumb').css('left', '70px');
			angular.element('.page-head .page-subtitle').css('left', '70px');

		}
	}

	function navTopbarReset() {
		ellipsed = [];
		angular.element('#ellipsistab').remove();
		angular.element('#nav-topbar ul.menu').find('li.maintab').each(function(){
			angular.element(this).removeClass('hide');
		});
	}

	//agregate out of bounds items from top menu into ellipsis dropdown
	function navTopbarEllipsis() {
		navTopbarReset();
		angular.element('#nav-topbar ul.menu').find('li.maintab').each(function(){
			if (angular.element(this).position().top > 0) {
				ellipsed.push(angular.element(this).html());
				angular.element(this).addClass('hide');
			}
		});
		if (ellipsed.length > 0) {
			angular.element('#nav-topbar ul.menu').append('<li id="ellipsistab" class="subtab has_submenu"><a href="#"><i class="icon-ellipsis-horizontal"></i></a><ul id="ellipsis_submenu" class="submenu"></ul></li>');
			for (var i = 0; i < ellipsed.length; i++) {
				angular.element('#ellipsis_submenu').append('<li class="subtab has_submenu">' + ellipsed[i] + '</li>');
			}
		}
	}

	//set main navigation on top
	function navTopbar() {
		navTopbarReset();
		angular.element('#nav-sidebar').attr('id','nav-topbar');
		var topbar = angular.element('#nav-topbar');
		topbar.off();
		angular.element('span.submenu_expand').remove();
		angular.element('.expanded').removeClass('expanded');
		// expand elements with submenu
		topbar.on('mouseenter', 'li.has_submenu', function(){
			angular.element(this).addClass('expanded');
		});
		topbar.on('mouseleave', 'li.has_submenu', function(){
			angular.element(this).removeClass('expanded');
		});
		// hide element over menu width on load
		navTopbarEllipsis();
		//hide element over menu width on resize
		angular.element(window).on('resize', function() {
			navTopbarEllipsis();
		});
	}

	//set main navigation for mobile devices
	function mobileNav() {
		navTopbarReset();
		// clean actual menu type
		// get it in navigation whatever type it is
		var navigation = angular.element('#nav-sidebar,#nav-topbar');
		navigation.find('.menu').hide();
		var submenu = "";
		// clean trigger
		navigation.off().attr('id','nav-mobile');
		angular.element('span.menu-collapse').off();
		navigation.on('click.collapse','span.menu-collapse',function(){
			if (angular.element(this).hasClass('expanded')){
				angular.element(this).html('<i class="icon-align-justify"></i>');
				navigation.find('ul.menu').hide();
				navigation.removeClass('expanded');
				angular.element(this).removeClass('expanded');
				//remove submenu when closing nav
				angular.element('#nav-mobile-submenu').remove();
			}
			else {
				angular.element(this).html('<i class="icon-remove"></i>');
				navigation.find('ul.menu').removeClass('menu-close').show();
				navigation.addClass('expanded');
				angular.element(this).addClass('expanded');
			}
		});
		//get click for item which has submenu
		navigation.on('click.submenu','.maintab.has_submenu a.title', function(e){
			e.preventDefault();
			navigation.find('.menu').addClass('menu-close');
			angular.element('#nav-mobile-submenu').remove();
			//create submenu
			submenu = angular.element('<ul id="nav-mobile-submenu" class="menu"><li><a href="#" id="nav-mobile-submenu-back"><i class="icon-arrow-left"></i>'+ angular.element(this).html() +'</a></li></ul>');
			submenu.append(angular.element(this).closest('.maintab').find('.submenu').html());
			//show submenu
			navigation.append(submenu);
			submenu.show();
		});
		navigation.on('click.back','#nav-mobile-submenu-back',function(e){
			e.preventDefault();
			submenu.remove();
			navigation.find('.menu').removeClass('menu-close').show();
		});
	}

	//unset mobile nav
	function removeMobileNav(){
		var navigation = angular.element('#nav-mobile');
		angular.element('#nav-mobile-submenu').remove();
		angular.element('span.menu-collapse').html('<i class="icon-align-justify"></i>');
		navigation.off();
		if (angular.element('body').hasClass('page-sidebar')){
			navigation.attr('id',"nav-sidebar");
			navSidebar();
		} else if (angular.element('body').hasClass('page-topbar')){
			navigation.attr('id',"nav-topbar");
			navTopbar();
		}
		navigation.find('.menu').show();
	}

	//init main navigation
	function initNav(){
		if (angular.element('body').hasClass('page-sidebar')){
			navSidebar();
		}
		else if (angular.element('body').hasClass('page-topbar')) {
			navTopbar();
		}
	}

	

	var ellipsed = [];
	initNav();

	// prevent mouseout + direct path to submenu on sidebar uncollapsed navigation + avoid out of bounds
	var closingMenu, openingMenu;
	angular.element('li.maintab.has_submenu').hover(function() {
		var submenu = angular.element(this);
		if (submenu.is('.active') && submenu.children('ul.submenu').is(':visible')) {
			return;
		}
		clearTimeout(openingMenu);
		clearTimeout(closingMenu);
		openingMenu = setTimeout(function(){
			angular.element('li.maintab').removeClass('hover');
			angular.element('ul.submenu.outOfBounds').removeClass('outOfBounds').css('top',0);
			submenu.addClass('hover');
			var h = angular.element( window ).height();
			var x = submenu.find('.submenu li').last().offset();
			var l = x.top + submenu.find('.submenu li').last().height();
			var f = 25;
			if (angular.element('#footer').is(':visible')){
				f = angular.element('#footer').height() + f;
			}
			var s = angular.element(document).scrollTop();
			var position = h - l - f + s;
			var out = false;
			if ( position < 0) {
				out = true;
				submenu.find('.submenu').addClass('outOfBounds').css('top', position);
			}
		},50);
	}, function() {
		var submenu = angular.element(this);
		closingMenu = setTimeout(function(){
			submenu.removeClass('hover');
		},250);
	});

	angular.element('ul.submenu').on('mouseenter', function(){
		clearTimeout(openingMenu);
	});
	
	//show footer when reach bottom
	function animateFooter(){
		if(angular.element(window).scrollTop() + angular.element(window).height() === angular.element(document).height()) {
			angular.element('#footer:hidden').removeClass('hide');
		} else {
			angular.element('#footer').addClass('hide');
		}
	}

	//scroll top
	function animateGoTop() {
		if (angular.element(window).scrollTop()) {
			angular.element('#go-top:hidden').stop(true, true).fadeIn();
			angular.element('#go-top:hidden').removeClass('hide');
		} else {
			angular.element('#go-top').stop(true, true).fadeOut();
		}
	}
});