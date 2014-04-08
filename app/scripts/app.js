'use strict';

angular.module('reqmeappcliApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'firebase',
  'angularfire.firebase',
  'angularfire.login',
  'simpleLoginTools',
  'angularFileUpload',
  'LocalStorageModule',
   'ui.bootstrap'

])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/login', {
            templateUrl: 'views/login.html',
            controller: 'LoginController'
        })
      .when('/profile', {
            templateUrl: 'views/register.html',
            controller: 'ProfileCtrl'
        })
        .when('/posting', {
            templateUrl: 'views/posting.html',
            controller: 'PostingCtrl'
        })
        .when('/status', {
            templateUrl: 'views/status.html',
            controller: 'StatusCtrl'
        })
        .when('/upload', {
            templateUrl: 'views/upload.html',
            controller: 'ProfileCtrl'
        })
      .otherwise({
        redirectTo: '/'
      });
  });
