(function(){
    'use strict';
    angular.module('app', [])
        .controller('GoosterController', ['$scope', goosterController]);
    function goosterController($scope){
        $scope.menuItems = [];
    }
})();
