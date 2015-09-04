'use strict';
(function(angular){
	angular.module('webcorp.ui.header',['webcorp.core','ui.bootstrap'])
	
	.directive('webcorpHeader',['$config','DefaultTemplateRoot',function($config,DefaultTemplateRoot){
		return{
			restrict:'E',
			replace:true,
			transclude:true,
			templateUrl:function(elem,attrs){
				return $config.get('TemplateRoot',DefaultTemplateRoot)+'header.tpl.html';
			}
		};
	}])
	
	.directive('headerElement',[function(){
		return{
			restrict:'E',
			require:'^header'
		};
	}])

	.directive('webcorpMain',['$config','DefaultTemplateRoot',function($config,DefaultTemplateRoot){
		return{
			restrict:'E',
			replace:true,
			transclude:true,
			templateUrl:function(elem,attrs){
				return $config.get('TemplateRoot',DefaultTemplateRoot)+'main.tpl.html';
			}
		};
	}])
	
	.directive('webcorpContent',['$config','DefaultTemplateRoot',function($config,DefaultTemplateRoot){
		return{
			restrict:'E',
			replace:true,
			transclude:true,
			templateUrl:function(elem,attrs){
				return $config.get('TemplateRoot',DefaultTemplateRoot)+'content.tpl.html';
			}
		};
	}])
	
	.directive('webcorpPageHead',['$compile','$config','DefaultTemplateRoot',function($compile,$config,DefaultTemplateRoot){
		return{
			restrict:'E',
			replace:true,
			transclude:true,
			templateUrl:function(elem,attrs){
				return  $config.get('TemplateRoot',DefaultTemplateRoot)+'pagehead.tpl.html';
			},
			scope:{
				title:'=',
				has_breadcrumb:'='
			},
			link:function($scope,$element,attrs){
				
				$scope.has_breadcrumb=angular.isDefined(attrs.breadcrumb);
				
				//alert($config.get('TemplateRoot',DefaultTemplateRoot)+'pagehead.tpl.html');
			}
		};
	}])
	.directive('webcorpPageHeadToolbar',['$config','DefaultTemplateRoot',function($config,DefaultTemplateRoot){
		return{
			restrict:'E',
			replace:true,
			//transclude:true,
			templateUrl:function(elem,attrs){
				return $config.get('TemplateRoot',DefaultTemplateRoot)+'pageheadtoolbar.tpl.html';
			}
			
		};
	}])
	.directive('webcorpPage',['$config','DefaultTemplateRoot',function($config,DefaultTemplateRoot){
		return{
			restrict:'E',
			replace:true,
			//transclude:true,
			templateUrl:function(elem,attrs){
				return $config.get('TemplateRoot',DefaultTemplateRoot)+'page.tpl.html';
			}
		};
	}])
	.directive('webcorpFooter',['$config','DefaultTemplateRoot',function($config,DefaultTemplateRoot){
		return{
			restrict:'E',
			replace:true,
			transclude:true,
			templateUrl:function(elem,attrs){
				return $config.get('TemplateRoot',DefaultTemplateRoot)+'footer.tpl.html';
			}
		};
	}])
	
	;
}(angular));