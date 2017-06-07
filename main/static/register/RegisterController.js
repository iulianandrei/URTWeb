(function(){
    'use strict';
    var app = angular.module('app');

    app.controller('SignupController', ['$scope', '$http', '$window', signupController]);
    function signupController($scope, $http, $window) {
        $scope.register_fail = false;
        $scope.user = {
            name:'',
            email: '',
            pwd: ''
        };
        $scope.$emit("FAVORITE_PLACES", $scope.preferences);
        //verificare daca sunt completate campurile de inregistrare
        function verifyUserData(){
            if(_.isEmpty($scope.user.name) ||_.isEmpty($scope.user.pwd) || _.isEmpty($scope.user.email)){
                return false;
            } else return true;
        }

        $scope.Sign_Up=function () {
            if(!verifyUserData()) {
                return;
            }
            //trimiterea datelor de inregistrare la server
            $http({
                method: 'POST',
                url: 'http://localhost:8000/api/users/create',
                data: JSON.stringify($scope.user),
                headers:{"Access-Control-Allow-Origin":" *"}
            }).then(
                function(res){
                    console.log(res);
                    $scope.register_fail = false;
                    $scope.$emit("FAVORITE_PLACES", $scope.preferences);
                    $window.location.href = "http://localhost:8000/login/";
                }, function(err){
                    if(err.status == 409)
                    $scope.register_fail = true;
                    console.log(err);
                }
            );
        };
    }
})();