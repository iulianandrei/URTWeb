(function(){
    'use strict';
    var app = angular.module('app', []);

    app.controller('SignupController', ['$scope', signupController]);
    function signupController($scope) {

        $scope.preferences = [
            {
                location: 'Mall',
                check: false
            },
            {
                location: 'Academic',
                check: false
            },
            {
                location: 'Food',
                check: false
            },
            {
                location: 'Supermarket',
                check: false
            },
            {
                location: 'Drink',
                check: false
            },
            {
                location: 'Caffeteria',
                check: false
            },
            {
                location: 'Internet Cafe',
                check: false
            },
            {
                location: 'Hospital',
                check: false
            },
            {
                location: 'Police',
                check: false
            },
            {
                location: 'Auto Service',
                check: false
            },
            {
                location: 'Hotels',
                check: false
            },
            {
                location: 'Parking Lot',
                check: false
            },
            {
                location: 'Banks',
                check: false
            },
            {
                location: 'ATM',
                check: false
            },
            {
                location: 'Pharmacy',
                check: false
            },
            {
                location: 'Post Office',
                check: false
            },
            {
                location: 'Club',
                check: false
            },
            {
                location: 'Parks',
                check: false
            },
            {
                location: 'Churches',
                check: false
            }
        ];
    }
})();