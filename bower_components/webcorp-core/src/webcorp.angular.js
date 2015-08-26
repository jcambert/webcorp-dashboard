angular.module('webcorp.core')
.factory('configService', function () {
    return new webcorp.ConfigService();
})
.factory('locationService', function () {
    return new webcorp.LocationService ();
})
;