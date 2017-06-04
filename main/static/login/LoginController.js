(function() {
        'use strict'

        var module = angular.module('app');
        var controllerId = 'LoginController';

        module.controller('LoginController', ['$scope', loginController]);

        function loginController($scope){
            $scope.number = 100;
            $scope.otherNumber = 10;
            console.log("login controller in");
        }
    }
)();

