'use strict';

var app = angular.module('app', ['ui.router']);
app.config(['$stateProvider','$locationProvider', function($stateProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
$locationProvider.prefix('!');
	
   // $stateProvider
//	.state('home', {
//	url: '',
  //         templateUrl: 'index.html'
    //   })
      //.state('login', {
       //     url: '/login',
         //   templateUrl: '/login/LoginView.html'
       // })
//	.state('main', {
  //          url: '/main',
    //        templateUrl: '/main/MainView.html'
      //  })
}]);
