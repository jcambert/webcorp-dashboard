'use strict';
(function(angular){
	angular.module('webcorp.ui.widget',['webcorp.core'])
	
	.directive('webcorpWidget',['$template',function($template){
		return{
			restrict:'E',
			replace:true,
			transclude:true,
			templateUrl:function(){return $template.get('widget');}
		};
	}])
	
	.directive('webcorpWidgetHead',['$log','$template',function($log,$template){
		return{
			restrict:'E',
			replace:true,
			transclude:true,
			scope:{
				icon:'=',
				title:'='
			},
			controller:['$scope',function($scope){
				$scope.actions=[];
				this.addAction=function(id,options){
					$log.log('adding widget head action:'+id);
					var tmp={
						id:id,
						title:options.title || '',
						tooltip:options.tooltip || '',
						icon:options.icon || ''
					};
					$scope.actions.push(tmp);
					$log.log('added widget head action:'+id);
					
				};
				$scope.launchAction=function(atl){
					$log.log('Want launching action:'+atl);
				};
			}],
			templateUrl:function(){return $template.get('widgethead');},
			link:function($scope,$element,attrs){
				$log.log('linking head');
				if(angular.isDefined(attrs.icon))$scope.icon=attrs.icon;
				if(angular.isDefined(attrs.title))$scope.title=attrs.title;
				$log.log('linked head');
			}
		};
	}])
	
	.directive('webcorpWidgetHeadAction',['$log',function($log){
		return{
			restrict:'E',
			
			require:'^webcorpWidgetHead',
			link:function($scope,$element,attrs,parentCtrl){
				$log.log('linking head action');
				
				//$log.log('Add Widget Head ACtion:'+attrs.id)
				parentCtrl.addAction(attrs.id,{icon:attrs.icon,title:attrs.title,tooltip:attrs.tooltip});
				$log.log('linked head action');
			}
		};
	}])
}(angular));