'use strict';

	 
var dashboard=angular.module('webcorp.dashboard',['webcorp.core']);
dashboard.config(['$logProvider',function($log){
	$log.debugEnabled(false);
	console.log('Application configurated');
}]);

dashboard.value('DefaultTemplateRoot','directives/templates/');

dashboard.run(['$log','configService','DefaultTemplateRoot',function($log,$config,$defaultTplRoot){
	
	$log.log('Application running');
	
	$config.set('TemplateRoot',$defaultTplRoot);
}]);

dashboard.controller('testctrl',['$scope','$log','Menus',function($scope,$log,$menus){
	$log.log('testctrl starting');
	$menus.add(null,'menu0',{label:'label0',route:'route_label0',icon:'tachometer'}).add(null,'menu1',{label:'label1',route:'route_label1',icon:'list-alt',isGroup:true}).add('menu1','menu2',{label:'label2',route:'route_label2'});
	$log.log('Menu');
	$log.log($menus.menus());
	$log.log('testctrl running');
	
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

dashboard.directive('menus',['DefaultTemplateRoot','Menus','configService',function($defaultTplRoot,$menus,$config){
	return {
		restrict:'E',
		replace:true,
		templateUrl:function(elem,attrs){
			return $config.get('TemplateRoot',$defaultTplRoot)+'menus.tpl.html';
		}
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
	 
angular.element(document).ready(function () {
	alert('Document Ready Start');
	//set main navigation aside
	/* global employee_token */
	function navSidebar(){
		alert('sidebar');
		var sidebar = $('#nav-sidebar');
		sidebar.off();
		$('.expanded').removeClass('expanded');
		$('.maintab').not('.active').closest('.submenu').hide();
		sidebar.on('click','.submenu_expand', function(){
			var $navId = $(this).parent();
			$('.submenu-collapse').remove();
			if($('.expanded').length ){
				$('.expanded > ul').slideUp('fast', function(){
					var $target = $('.expanded');
					$target.removeClass('expanded');
					$($navId).not($target).not('.active').addClass('expanded');
					$($navId).not($target).not('.active').children('ul:first').hide().slideDown();
				});
			}
			else {
				$($navId).not('.active').addClass('expanded');
				$($navId).not('.active').children('ul:first').hide().slideDown();
			}
		});
		//sidebar menu collapse
		sidebar.find('.menu-collapse').on('click',function(){
			$(this).toggleClass('icon-rotate-90');

			if ($(this).hasClass('icon-rotate-90')) {
				$(this).css('margin-left', '5px');
				$('.page-head .page-title').css('padding-left', '70px');
				$('.page-head .breadcrumb').css('left', '70px');
				$('.page-head .page-subtitle').css('left', '70px');

			} else {
				$(this).css('margin-left', '');
				$('.page-head .page-title').css('padding-left', '230px');
				$('.page-head .breadcrumb').css('left', '230px');
				$('.page-head .page-subtitle').css('left', '230px');
			}

			$('body').toggleClass('page-sidebar-closed');
			$('.expanded').removeClass('expanded');
			/*$.ajax({
				url: "index.php",
				cache: false,
				data: "token="+employee_token+'&ajax=1&action=toggleMenu&tab=AdminEmployees&collapse='+Number($('body').hasClass('page-sidebar-closed'))
			});*/
		});

		var menuCollapse = sidebar.find('.menu-collapse');

		if ($('body').hasClass('page-sidebar-closed')) {
			menuCollapse.addClass('icon-rotate-90');
			menuCollapse.css('margin-left', '5px');
			$('.page-head .page-title').css('padding-left', '70px');
			$('.page-head .breadcrumb').css('left', '70px');
			$('.page-head .page-subtitle').css('left', '70px');

		}
	}

	function navTopbarReset() {
		ellipsed = [];
		$('#ellipsistab').remove();
		$('#nav-topbar ul.menu').find('li.maintab').each(function(){
			$(this).removeClass('hide');
		});
	}

	//agregate out of bounds items from top menu into ellipsis dropdown
	function navTopbarEllipsis() {
		navTopbarReset();
		$('#nav-topbar ul.menu').find('li.maintab').each(function(){
			if ($(this).position().top > 0) {
				ellipsed.push($(this).html());
				$(this).addClass('hide');
			}
		});
		if (ellipsed.length > 0) {
			$('#nav-topbar ul.menu').append('<li id="ellipsistab" class="subtab has_submenu"><a href="#"><i class="icon-ellipsis-horizontal"></i></a><ul id="ellipsis_submenu" class="submenu"></ul></li>');
			for (var i = 0; i < ellipsed.length; i++) {
				$('#ellipsis_submenu').append('<li class="subtab has_submenu">' + ellipsed[i] + '</li>');
			}
		}
	}

	//set main navigation on top
	function navTopbar() {
		navTopbarReset();
		$('#nav-sidebar').attr('id','nav-topbar');
		var topbar = $('#nav-topbar');
		topbar.off();
		$('span.submenu_expand').remove();
		$('.expanded').removeClass('expanded');
		// expand elements with submenu
		topbar.on('mouseenter', 'li.has_submenu', function(){
			$(this).addClass('expanded');
		});
		topbar.on('mouseleave', 'li.has_submenu', function(){
			$(this).removeClass('expanded');
		});
		// hide element over menu width on load
		navTopbarEllipsis();
		//hide element over menu width on resize
		$(window).on('resize', function() {
			navTopbarEllipsis();
		});
	}

	//set main navigation for mobile devices
	function mobileNav() {
		navTopbarReset();
		// clean actual menu type
		// get it in navigation whatever type it is
		var navigation = $('#nav-sidebar,#nav-topbar');
		navigation.find('.menu').hide();
		var submenu = "";
		// clean trigger
		navigation.off().attr('id','nav-mobile');
		$('span.menu-collapse').off();
		navigation.on('click.collapse','span.menu-collapse',function(){
			if ($(this).hasClass('expanded')){
				$(this).html('<i class="icon-align-justify"></i>');
				navigation.find('ul.menu').hide();
				navigation.removeClass('expanded');
				$(this).removeClass('expanded');
				//remove submenu when closing nav
				$('#nav-mobile-submenu').remove();
			}
			else {
				$(this).html('<i class="icon-remove"></i>');
				navigation.find('ul.menu').removeClass('menu-close').show();
				navigation.addClass('expanded');
				$(this).addClass('expanded');
			}
		});
		//get click for item which has submenu
		navigation.on('click.submenu','.maintab.has_submenu a.title', function(e){
			e.preventDefault();
			navigation.find('.menu').addClass('menu-close');
			$('#nav-mobile-submenu').remove();
			//create submenu
			submenu = $('<ul id="nav-mobile-submenu" class="menu"><li><a href="#" id="nav-mobile-submenu-back"><i class="icon-arrow-left"></i>'+ $(this).html() +'</a></li></ul>');
			submenu.append($(this).closest('.maintab').find('.submenu').html());
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
		var navigation = $('#nav-mobile');
		$('#nav-mobile-submenu').remove();
		$('span.menu-collapse').html('<i class="icon-align-justify"></i>');
		navigation.off();
		if ($('body').hasClass('page-sidebar')){
			navigation.attr('id',"nav-sidebar");
			navSidebar();
		} else if ($('body').hasClass('page-topbar')){
			navigation.attr('id',"nav-topbar");
			navTopbar();
		}
		navigation.find('.menu').show();
	}

	//init main navigation
	function initNav(){
		if ($('body').hasClass('page-sidebar')){
			navSidebar();
		}
		else if ($('body').hasClass('page-topbar')) {
			navTopbar();
		}
	}

	

	var ellipsed = [];
	initNav();

	// prevent mouseout + direct path to submenu on sidebar uncollapsed navigation + avoid out of bounds
	var closingMenu, openingMenu;
	$('li.maintab.has_submenu').hover(function() {
		var submenu = $(this);
		if (submenu.is('.active') && submenu.children('ul.submenu').is(':visible')) {
			return;
		}
		clearTimeout(openingMenu);
		clearTimeout(closingMenu);
		openingMenu = setTimeout(function(){
			$('li.maintab').removeClass('hover');
			$('ul.submenu.outOfBounds').removeClass('outOfBounds').css('top',0);
			submenu.addClass('hover');
			var h = $( window ).height();
			var x = submenu.find('.submenu li').last().offset();
			var l = x.top + submenu.find('.submenu li').last().height();
			var f = 25;
			if ($('#footer').is(':visible')){
				f = $('#footer').height() + f;
			}
			var s = $(document).scrollTop();
			var position = h - l - f + s;
			var out = false;
			if ( position < 0) {
				out = true;
				submenu.find('.submenu').addClass('outOfBounds').css('top', position);
			}
		},50);
	}, function() {
		var submenu = $(this);
		closingMenu = setTimeout(function(){
			submenu.removeClass('hover');
		},250);
	});

	$('ul.submenu').on('mouseenter', function(){
		clearTimeout(openingMenu);
	});
	
	//show footer when reach bottom
	function animateFooter(){
		if($(window).scrollTop() + $(window).height() === $(document).height()) {
			$('#footer:hidden').removeClass('hide');
		} else {
			$('#footer').addClass('hide');
		}
	}

	//scroll top
	function animateGoTop() {
		if ($(window).scrollTop()) {
			$('#go-top:hidden').stop(true, true).fadeIn();
			$('#go-top:hidden').removeClass('hide');
		} else {
			$('#go-top').stop(true, true).fadeOut();
		}
	}
	
	alert('Document Ready End');
});