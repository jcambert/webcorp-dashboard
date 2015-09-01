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
	
	.directive('webcorpFooter',['$config',function($config){
		return{
			restrict:'E',
			replace:true,
			transclude:true,
			templateUrl:function(elem,attrs){
				return $config.get('TemplateRoot','directives/templates/')+'footer.tpl.html';
			}
		};
	}])
	
	;
}(angular));