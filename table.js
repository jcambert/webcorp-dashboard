(function(angular){
	'use strict';
	var table=angular.module('webcorp.ui.table',['webcorp.core']);
	
	table.directive('wTable',['$log','$compile',function($log,$compile){
		return{
			restrict:'E',
			template:'<table></table>',
			replace:true,
			//transclude:true,
			scope:{
				wSource:'='
			},
			controller:function($scope){
				
			},
			link:function($scope,$element,attrs,controller){
				$log.log('---------- wTable START LINK ------------------------');

				console.dir($element.contents().find('tbody').length);
				if($scope.wSource.showhead)
					$element.append('<w-table-head columns="wSource.columns" ><w-table-head>');
				$element.append('<w-table-body lines="wSource.source" columns="wSource.columns"></w-table-body>')
				$compile($element.contents())($scope);
				$log.log('---------- wTable   END LINK ------------------------');

			
			}
		};
		
	}])
	
	table.directive('wTableHead',['$log','$compile','$template',function($log,$compile,$template){
		return{
			restrict:'E',
			replace:true,
			
			require:'^wTable',
			templateUrl:function(){return $template.get('tablehead');}	,
			scope:{
				columns:'=',
				
			},
			link:function($scope,$element,attrs,parentCtrl){
				$log.log('---------- wTableHead START LINK ------------------------');
				$log.log('---------- wTableHead   END LINK ------------------------');
			}
		};
	}]);
	
	table.directive('wTableBody',['$log','$compile', '$template',function($log,$compile,$template){
		return {
			restrict:'E',
			replace:true,
			require:'^wTable',
			controller:function($scope){
				
			},
			templateUrl:function(){return $template.get('tablebody');}	,
			scope:{
				lines:'=',
				columns:'='
			},
			link:function($scope,$element,attrs,parentCtrl){
				$log.log('---------- wTableBody START LINK ------------------------');
				console.dir($scope.lines);
				console.dir($scope.columns);
				$compile($element)($scope);
				$log.log('---------- wTableBody   END LINK ------------------------');
				
			}
		};
	}]);
	
	table.directive('wRenderer',['$log','$template',function($log,$template){
		return {
			restrict:'A',
			//replace:true,
			require:'^wTableBody',
			
			scope:{
				index:'=',
				line:'='
			},
			//templateUrl:function(){return $template.get('tableCellStringRenderer');}	,
			link:function($scope,$element,attrs,parentCtrl){
				$log.log('---------- wTableCellRenderer START LINK ------------------------');
					console.dir($scope.index);
					
					/*if($scope.cell.cellrenderer)
						$element.append($scope.cell.cellrenderer());
					else*/
					$element.append('<td>'+$scope.line[$scope.] +'</td>')*/
				
				$log.log('---------- wTableCellRenderer   END LINK ------------------------');
				
			}
		};
	}]);
	
	table.factory('wDataAdapter',[function(){
		
		
		
	}]);
}(angular));