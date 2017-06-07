(function() {
        'use strict'

        var app = angular.module('app', []);
        var controllerId = 'LoginController';

        app.controller(controllerId, ['$scope', '$http', '$window', loginController]);

        function loginController($scope, $http, $window){
            $scope.login_fail = false;
            $scope.user = {
                email: '',
                pwd: ''
            };

            // verificam daca sunt completate campurile
            function verifyUserData(){
                if(_.isEmpty($scope.user.pwd) || _.isEmpty($scope.user.email)){
                    return false;
                } else return true;
            }

            $scope.login=function () {
                if(!verifyUserData()) {
                    return;
                }
                // trimitere JSON cu datele de autentificare
                $http({
                    method: 'POST',
                    url: 'http://localhost:8000/api/users/check',
                    data: JSON.stringify($scope.user),
                    headers:{"Access-Control-Allow-Origin":" *"}
                }).then(function(res){
                    console.log(res);
                    // primire raspuns de la server daca userul exista sau nu
                    if(res.data.status === 'Accepted'){
                        localStorage.setItem('user_email', $scope.user.email);
                         $window.location.href = "http://localhost:8000/map/";
                         $scope.login_fail = false;
                    } else{
                        $scope.login_fail = 'Data already in use';
                    }},
                    function(err){
                    if(err.status == 401){
                        $scope.login_fail = "Bad Credentials";
                    }
                    console.log(err)
                });
            };
        }
    }
)();

