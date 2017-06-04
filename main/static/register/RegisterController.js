(function(){
    'use strict';
    var app = angular.module('app', []);

    app.controller('SignupController', ['$scope', '$http',signupController]);
    function signupController($scope,$http) {

        $scope.user = {
            name:'',
            email: '',
            pwd: ''
        };

        function verifyUserData(){
            if(_.isEmpty($scope.user.name) ||_.isEmpty($scope.user.pwd) || _.isEmpty($scope.user.email)){
                return false;
            } else return true;
        }

        $scope.Sign_Up=function () {
            if(!verifyUserData()) {
                return;
            }
            $http({
                method: 'POST',
                url: 'http://localhost:8000/api/users/create',
                data: $scope.user,
                headers:{"Access-Control-Allow-Origin":" *"}
            }).then(function(res){
                console.log(res)},
                function(err){console.log(err)
            });
        };

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