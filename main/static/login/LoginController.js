(function() {
        'use strict'

        var app = angular.module('app', []);
        var controllerId = 'LoginController';

        app.controller(controllerId, ['$scope', '$http', '$window', loginController]);

        function loginController($scope, $http, $window){

        $scope.user = {
            email: '',
            pwd: ''
        };

        function verifyUserData(){
            if(_.isEmpty($scope.user.pwd) || _.isEmpty($scope.user.email)){
                return false;
            } else return true;
        }

        $scope.login=function () {
            if(!verifyUserData()) {
                return;
            }
            $http({
                method: 'POST',
                url: 'http://localhost:8000/api/users/check',
                data: JSON.stringify($scope.user),
                headers:{"Access-Control-Allow-Origin":" *"}
            }).then(function(res){
                console.log(res);
                if(res.status === 'Accepted'){
                    localStorage.setItem('email', $scope.user.email);
                     $window.location.href = "http://localhost:8000/map/";
                }},
                function(err){console.log(err)

            });
        };



        }
    }
)();

