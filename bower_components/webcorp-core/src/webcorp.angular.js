angular.module('webcorp.core',[])
.factory('$config', function () {
    return new webcorp.ConfigService();
})
.factory('locationService', function () {
    return new webcorp.LocationService ();
})
.service('$template',['$config',function($config){
    this.get = function(name){
        return $config.get('TemplateRoot','directives/templates/')+name+'.tpl.html';
    }
}])
;