(function(){
    'use strict';
    var app = angular.module('app');

    app.controller('SignupController', ['$scope', '$http', '$window', signupController]);
    function signupController($scope, $http, $window) {

        $scope.user = {
            name:'',
            email: '',
            pwd: ''
        };
        $scope.$emit("FAVORITE_PLACES", $scope.preferences);
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
                data: JSON.stringify($scope.user),
                headers:{"Access-Control-Allow-Origin":" *"}
            }).then(
                function(res){
                    console.log(res);
                    $scope.$emit("FAVORITE_PLACES", $scope.preferences);
                    $window.location.href = "http://localhost:8000/login/";
                }, function(err){
                    console.log(err)
                }
            );
        };
    }
})();