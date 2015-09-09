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
			controller:function($scope){
				$scope.hasFilter = function(){
					var res=false;
					_.forEach($scope.columns,function(tabledef){
						if(tabledef.column.filterable){
							res=true;
							return
						}
						
					});
					return res;
				}
			},
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
				this.getColumns=function(){
					return $scope.columns;
				};
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
	
	table.directive('wTableCell',['$log','$compile','$template',function($log,$compile,$template){
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
				$log.log('---------- wTableCell START LINK ------------------------');
					console.dir($scope.index);
					console.dir($scope.line);
					console.dir(parentCtrl.getColumns());
					console.dir(parentCtrl.getColumns()[$scope.index].name);
					console.dir($scope.line[ parentCtrl.getColumns()[$scope.index].name]);
					var tabledef=parentCtrl.getColumns()[$scope.index];
					
					console.dir(tabledef);
					var value=$scope.line[ tabledef.name];
					var defaultHtml=angular.element('<td>'+value+'</td>');
					
					if(tabledef.cell.cellrenderer){
						if(angular.isFunction(tabledef.cell.cellrenderer)){
							var tpl=tabledef.cell.cellrenderer($scope.line,tabledef.name,value,defaultHtml,tabledef,$scope.index);
							$compile(tpl)($scope);
							$element.append(tpl);
							
						}else{
							$template.load(tabledef.cell.cellrenderer).then(
								function(tpl){
									$compile(tpl)($scope);
									$element.append(tpl);
									
								}, 
								function(msg){
									$log.error(msg);
								});
						}
					}else{
						if(tabledef.cell.clazz)defaultHtml.addClass(tabledef.cell.clazz);
						//if(column.width)defaultHtml.css('width',column.width); => to header
						$element.append(defaultHtml);
					}
				
				$log.log('---------- wTableCell   END LINK ------------------------');
				
			}
		};
	}]);
	
	table.directive('wTableFilter',['$log',function($log){
		return {
			restrict:'A',
			require:'^wTable',
			scope:{
				index:'=',
				columns:'='
			},
			link:function($scope,$element,attrs,parentCtrl){
				$log.log('---------- wTableFilter START LINK ------------------------');
				
				var tabledef=$scope.columns[$scope.index];
				console.dir(tabledef);
				if(tabledef.column.type=='action'){
					var tpl=[
								'<span class="pull-right">',
									'<button type="submit" id="submitFilterButtonorder" name="submitFilter" class="btn btn-default" data-list-id="order">',
										'<i class="icon-search"></i> Rechercher',
									'</button>',
								'</span>',
							];
							$element.append(tpl.join(''));
							$element.addClass('actions');
					$log.log('---------- wTableFilter END   LINK ------------------------');
					return;
				}
				if(tabledef.column.filterable)
					$element.append('<input type="text" class="filter" name="'+tabledef.name+'_filter" value="">');
				$log.log('---------- wTableFilter END   LINK ------------------------');
				
			}	
		};
	}])
	table.factory('wDataAdapter',[function(){
		
		
		
	}]);
}(angular));