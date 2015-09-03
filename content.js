'use strict';
(function(angular){
	angular.module('webcorp.ui.header',['webcorp.core','ui.bootstrap'])
	
	.directive('webcorpHeader',['$config',function($config){
		return{
			restrict:'E',
			replace:true,
			transclude:true,
			templateUrl:function(elem,attrs){
				return $config.get('TemplateRoot','directives/templates/')+'header.tpl.html';
			}
		};
	}])
	
	.directive('headerElement',[function(){
		return{
			restrict:'E',
			require:'^header'
		};
	}])
	
	.directive('webcorpMain',['$config',function($config){
		return{
			restrict:'E',
			replace:true,
			transclude:true,
			templateUrl:function(elem,attrs){
				return $config.get('TemplateRoot','directives/templates/')+'main.tpl.html';
			}
		};
	}])
	
	.directive('webcorpContent',['$config',function($config){
		return{
			restrict:'E',
			replace:true,
			transclude:true,
			templateUrl:function(elem,attrs){
				return $config.get('TemplateRoot','directives/templates/')+'content.tpl.html';
			}
		};
	}])
	
	.directive('webcorpPageHead',['$config',function($config){
		return{
			restrict:'E',
			replace:true,
			//transclude:true,
			templateUrl:function(elem,attrs){
				return $config.get('TemplateRoot','directives/templates/')+'pagehead.tpl.html';
			},
			scope:{
				title:'=',
				has_breadcrumb:'='
			},
			link:function($scope,$element,attrs){
				//alert(angular.isDefined(attrs.breadcrumb));
				$scope.has_breadcrumb=angular.isDefined(attrs.breadcrumb);
			}
		};
	}])
	.directive('webcorpPageHeadToolbar',['$config',function($config){
		return{
			restrict:'E',
			replace:true,
			//transclude:true,
			templateUrl:function(elem,attrs){
				return $config.get('TemplateRoot','directives/templates/')+'pageheadtoolbar.tpl.html';
			}
		};
	}])
	.directive('webcorpPage',['$config',function($config){
		return{
			restrict:'E',
			replace:true,
			//transclude:true,
			templateUrl:function(elem,attrs){
				return $config.get('TemplateRoot','directives/templates/')+'page.tpl.html';
			}
		};
	}])
	.directive('webcorpFooter',['$config',function($config){
		return{
			restrict:'E',
			replace:true,
			//transclude:true,
			templateUrl:function(elem,attrs){
				return $config.get('TemplateRoot','directives/templates/')+'footer.tpl.html';
			}
		};
	}])
	
	;
}(angular));