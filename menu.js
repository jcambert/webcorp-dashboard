'use strict';
(function(angular,$,_){


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
	this.$get = ['$log','$document', '$interpolate','$compile','$templateRequest','$menus','configService',function($log,$document,$interpolate,$compile,$templateRequest,$menus,$config){
		return function $menu(type,options){
			options = angular.extend({}, defaultOptions, globalOptions, options);
		 	//var directiveName = snake_case(type);
		 	//var startSym = $interpolate.startSymbol();
			//var endSym = $interpolate.endSymbol();
			
			function navSidebar(){
				$log.log('init nav');
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
					$.ajax({
						url: "index.php",
						cache: false,
						data: "token="+employee_token+'&ajax=1&action=toggleMenu&tab=AdminEmployees&collapse='+Number($('body').hasClass('page-sidebar-closed'))
					});
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
			
			
			
			function scroll_if_anchor(href) {
				href = typeof(href) === "string" ? href : $(this).attr("href");
				var fromTop = 120;
				if(href.indexOf("#") === 0) {
					var $target = $(href);
					if($target.length) {
						$('html, body').animate({ scrollTop: $target.offset().top - fromTop });
						if(history && "pushState" in history) {
							history.pushState({}, document.title, window.location.href + href);
							return false;
						}
					}
				}
			}
			var timer;
			var ellipsed = [];
			
			// prevent mouseout + direct path to submenu on sidebar uncollapsed navigation + avoid out of bounds
			var closingMenu, openingMenu;
			
			
			function execute(){
				
				
				initNav();
				
				$('li.maintab.has_submenu').hover(function() {
					$log.log('sub menu hover start');
					var submenu = $(this);
					if (submenu.is('.active') && submenu.children('ul.submenu').is(':visible')) {
						return;
					}
					clearTimeout(openingMenu);
					clearTimeout(closingMenu);
					openingMenu = setTimeout(function(){
						$log.log('opening menu');
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
					$log.log('sub menu hover end');
				}, function() {
					var submenu = $(this);
					closingMenu = setTimeout(function(){
						submenu.removeClass('hover');
					},250);
				});
			
				$('ul.submenu').on('mouseenter', function(){
					clearTimeout(openingMenu);
				});
			
				//media queries - depends of enquire.js
				/*global enquire*/
				enquire.register('screen and (max-width: 1200px)', {
					match : function() {
						if( $('#main').hasClass('helpOpen')) {
							$('.toolbarBox a.btn-help').trigger('click');
						}
					},
					unmatch : function() {
			
					}
				});
				enquire.register('screen and (max-width: 768px)', {
					match : function() {
			
						$('body.page-sidebar').addClass('page-sidebar-closed');
					},
					unmatch : function() {
						$('body.page-sidebar').removeClass('page-sidebar-closed');
					}
				});
				enquire.register('screen and (max-width: 480px)', {
					match : function() {
						$('body').addClass('mobile-nav');
						mobileNav();
					},
					unmatch : function() {
						$('body').removeClass('mobile-nav');
						removeMobileNav();
					}
				});
			
				//bootstrap components init
				$('.dropdown-toggle').dropdown();
				$('.label-tooltip, .help-tooltip').tooltip();
				$('#error-modal').modal('show');
			
				//init footer
				animateFooter();
			
				// go on top of the page
				$('#go-top').on('click',function() {
					$('html, body').animate({ scrollTop: 0 }, 'slow');
					return false;
				});
			
				
				$(window).scroll(function() {
					if(timer) {
						window.clearTimeout(timer);
					}
					timer = window.setTimeout(function() {
						animateGoTop();
						animateFooter();
					}, 100);
				});
			
				// search with nav sidebar closed
				$(document).on('click', '.page-sidebar-closed .searchtab' ,function() {
					$(this).addClass('search-expanded');
					$(this).find('#bo_query').focus();
				});
			
				$('.page-sidebar-closed').click(function() {
					$('.searchtab').removeClass('search-expanded');
				});
			
				$('#header_search button').on('click', function(e){
					e.stopPropagation();
				});
			
				//erase button search input
				if ($('#bo_query').val() !== '') {
					$('.clear_search').removeClass('hide');
				}
			
				$('.clear_search').on('click', function(e){
					e.stopPropagation();
					e.preventDefault();
					var id = $(this).closest('form').attr('id');
					$('#'+id+' #bo_query').val('').focus();
					$('#'+id+' .clear_search').addClass('hide');
				});
				$('#bo_query').on('keydown', function(){
					if ($('#bo_query').val() !== ''){
						$('.clear_search').removeClass('hide');
					}
				});
			
				//search with nav sidebar opened
				$('.page-sidebar').click(function() {
					$('#header_search .form-group').removeClass('focus-search');
				});
			
				$('#header_search #bo_query').on('click', function(e){
					e.stopPropagation();
					e.preventDefault();
					if($('body').hasClass('mobile-nav')){
						return false;
					}
					$('#header_search .form-group').addClass('focus-search');
				});
			
				//select list for search type
				$('#header_search_options').on('click','li a', function(e){
					e.preventDefault();
					$('#header_search_options .search-option').removeClass('active');
					$(this).closest('li').addClass('active');
					$('#bo_search_type').val($(this).data('value'));
					$('#search_type_icon').removeAttr("class").addClass($(this).data('icon'));
					$('#bo_query').attr("placeholder",$(this).data('placeholder'));
					$('#bo_query').focus();
				});
			
				// reset form
				/* global header_confirm_reset, body_confirm_reset, left_button_confirm_reset, right_button_confirm_reset */
				$(".reset_ready").click(function () {
					var href = $(this).attr('href');
					confirm_modal( header_confirm_reset, body_confirm_reset, left_button_confirm_reset, right_button_confirm_reset,
						function () {
							window.location.href = href + '&keep_data=1';
						},
						function () {
							window.location.href = href + '&keep_data=0';
					});
					return false;
				});
			
				//scroll_if_anchor(window.location.hash);
				$("body").on("click", "a.anchor", scroll_if_anchor);
				$log.log('executed');
			}
			
			return {
				restrict:'E',
				replace:true,
				templateUrl:function(elem,attrs){
						return $config.get('TemplateRoot','directives/templates/')+'menus.tpl.html';
					},
				scope:{
					menus:'='
				},
				controller:function($log,$scope,$document){
						angular.element($document).ready(function (){
							
							$log.log('doc ready');
							//execute();
						});
						$scope.mouse=function(){
								
						};
				},
				link:function($scope,$element,attrs,menuCtrl){
					$log.log($element.html());
					$element.closest('#maintab').hover(function(){
						$log.log('internal li hover');
					});
				}
				/*link:function($scope,$element,attrs,menuCtrl){
					$templateRequest($config.get('TemplateRoot','directives/templates/')+'menus.tpl.html').then(function(template){
						$log.log($scope.menus);
						var elem=angular.element(template);
						$log.log(elem);
						var linker = $compile(elem);
						linker($scope);
						$log.log(elem);
						$element.parent().append(elem);
						
						$log.log($(elem).html());
						$(elem).find('li').hover(function(){
							$log.log('internal li hover');
						});
						//execute();
						
						
						
					});
					
					
					$log.log('linked');
				}*/
						
						/*var template=angular.element('<ul class="menu"><li data-ng-repeat="menu in menus" class="maintab " ng-class="{has_submenu:menu.items}" data-submenu="{{$index}}"><a href="#" class="title" ng-if="menu.shouldRender()" ui-sref="{{menu.route}}"><i class="fa fa-{{menu.icon}}"></i><span>{{menu.label}}</span></a><ul data-ng-if="menu.items"  class="submenu" style="top: 0px;"><li data-ng-repeat="item in menu.items"><a href="#" class="title" ng-if="item.label.length>0 && item.shouldRender()" ui-sref="{{item.route}}">{{item.label}}</a></li></ul></li></ul>');*/

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
	 	//$log.log('----- START EXIST ------');  
		var result = find(id);
		//$log.log('Exist find:'+result);
		//$log.log('----- END EXIST ------');
		 return result!='';
	 }
	 
	 var findMenu = function(menus,id){
			//$log.log('----- FIND INDEX ------');  
		 	//$log.log('findIndex menus:'+id);$log.log(menus);
			 if(menus.length==0)return '';
			 for(var i=0;i<menus.length;i++){
			 	var menu=menus[i];
				//$log.log('current menu:'+i);
			 	//$log.log(menus[i]);
			 	//$log.log('findIndex:'+menu.id+':'+id);
				var result= (menu.id==id);
				//$log.log('result:'+result);
				if(result) return menu;
				if(Array.isArray(menu.items)){
					// $log.log('search in subitems');
				 	return findMenu(menu.items);
				 }else{
					 //$log.log(menu);
					 //$log.log('menu has no subitems');
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
		//$log.log('****************************************' );
		//$log.log('Try Adding Menu:'+itemId + ' to ' + groupId);
		if(exist(itemId))return self;
		
		options = options || {};
		
		
		var group=(groupId!=null?find(groupId).items:menus);

		group.push( builder(itemId,options) );

		//$log.log('Menus Add');
		//$log.log(menus);
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
}(angular,$,_));