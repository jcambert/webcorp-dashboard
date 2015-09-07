'use strict';
(function(angular){
	angular.module('webcorp.ui.widget',['webcorp.core'])
	
	.directive('webcorpWidget',['$template',function($template){
		return{
			restrict:'E',
			replace:true,
			transclude:true,
			scope:{
				
			},
			templateUrl:function(){return $template.get('widget');},
			link:function($scope,$element,attrs){
				if(angular.isDefined(attrs.wId))$scope.id=attrs.wId;
			}
		};
	}])
	
	.directive('webcorpWidgetHead',['$log','$template',function($log,$template){
		return{
			restrict:'E',
			replace:true,
			transclude:true,
			controller:['$scope',function($scope){
				
			}],
			scope:{
				badge:"=",
			},
			templateUrl:function(){return $template.get('widgethead');},
			link:function($scope,$element,attrs){
				$log.log('linking head');
				if(angular.isDefined(attrs.wIcon))$scope.icon=attrs.wIcon;
				if(angular.isDefined(attrs.wTitle))$scope.title=attrs.wTitle;
				//if(angular.isDefined(attrs.wbadge))$scope.badge=attrs.wBadge;
				$log.log('Badge:'+$scope.badge);
				$log.log('linked head');
				
			}
		};
	}])
	
	
	
	.directive('webcorpWidgetHeadAction',['$log','$compile','$template',function($log,$compile,$template){
		return{
			restrict:'E',
			require:'^webcorpWidgetHead',
			replace:true,
			scope:{
				onClick:'&',
			},
			templateUrl:$template.get('widgetHeadAction'),
			controller:function($scope){
				
			},
			link:function($scope,$element,attrs){
				if(angular.isDefined(attrs.wIcon))$scope.icon=attrs.wIcon;
				$compile($element.contents())($scope.$new());
			}
		};
	}])
}(angular));