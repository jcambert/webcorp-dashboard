/*


*/
webcorp.dependencies.add('erp.chiffrage');

(function(angular){
	'use strict';

var chiffrage=angular.module('erp.chiffrage',['ui.router', 'webcorp.core','webcorp.ui.menu']);

chiffrage.config(['$logProvider','$stateProvider','$wviewProvider',function($log,$stateProvider,$wview){
	$stateProvider
    
	.state('chiffrage', {
      url: '/chiffrage',
	 views:{
		  'pagehead':{templateUrl: function(){ return $wview.head('chiffrage','index');},controller:function(){}},
		  'pagecontent':{templateUrl: function(){return $wview.content('chiffrage','index');},controller:function(){}}
	  }
    })
	;
}]);

chiffrage.controller('chiffrageCtrl',['$log', '$scope',function($log,$scope){
	$scope.chiffrages=[];
	$scope.chiffrages.push({id:5});
	$scope.chiffrages.push({id:10});
	console.dir($scope.chiffrages);
	
	var cs=[{
			id:0,dp:4336,reference:'Cheminee',designation:'cheminee designation',indice:'',clientid:'Quatre Heurie',deviseur:'Ambert jc',
			tarifs:
			[{
				qte:1,coef:40,puventecalc:1000,puvente:1000,
				ts:[{type:'peinture liquide',prix:50},{type:'usinage esti',prix:25}]
			}],
			articles:
			[{
				reference:'Rep1',longueur:'1440',largeur:1200,epaisseur:4,nuance:'XC10>3',qte:1,prixachatmat:0.65,prixunitaire:46.8,total:50,surface:3.46,poidspiece:55,
				toles:
				[{
					squelettex:5,squelettey:5,
					formats:
					[{
						selected:0,dispo:0,x:4000,y:2000},{selected:1,dispo:1,x:3000,y:1500,qtetole:2,poidspiece:72,chute:0.23,formatx:1500,formaty:1500
					}], 
				}],
				composants:[{type:'ecrou acier',qte:5,prixunitaire:0.15,total:0.75}],
				operations:
				[{
					operation:'Laser Bystronic',qte:1,preparation:{tx:70,tps:0.15,cout:10.5},execution:{tx:110,tpsbase:0.0395,tps:0.0395,cout:4.345},gaz:'oxygene',lgdecoupe:5280,nbdiam:10,nbamorce:11
				},{
					operation:'pliage',qte:3,preparation:{tx:90,tps:0.25,cout:22.5},execution:{tx:120,tpsbase:0.006,tps:0.018,cout:2.16}
				}]
			}],		
	}];
	
	var designationRenderer = function (row, columnfield, value, defaulthtml, columnproperties, rowdata) {
	}
	
	var source={
		showhead:true,
		columns:[
			{name:'reference',title:'Reference',sortable:true,filterable:true, type:'string'},
			{name:'designation',title:'Designation',type:'string',width:'250px',cellrenderer:designationRenderer}
			
		],
		source:cs
	}
	
	$scope.datas=source;
}]);

chiffrage.run(['$rootScope', '$log','$menus',function($rootScope,$log,$menus){
	var menus=[
		{groupId:null,itemId:'menu1',options:{label:'Chiffrage',route:'chiffrage',icon:'eur',tooltip:'Gestion des chiffrage'}},		
		];
	$menus.add(menus);
}])

}(angular));

