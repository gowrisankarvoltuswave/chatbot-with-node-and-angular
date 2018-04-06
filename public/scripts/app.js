// 'use strict';

/**
 * @ngdoc overview
 * @name authApp
 * @description
 * # authApp
 *
 * Main module of the application.
 */

/*jshint -W079 */

var app = angular
    .module('authApp', [
        'ui.router',
        'ngResource',
        'ngSanitize'
        // 'socialLogin'
    ])


    .config(['$stateProvider', '$urlRouterProvider', '$httpProvider', function ($stateProvider, $urlRouterProvider, $httpProvider) {
        // $httpProvider.interceptors.push('Interceptor');
        $urlRouterProvider.otherwise('/login');

        $stateProvider
            //login
            .state('login', {
                url: '/login',
                controller: 'loginCtrl',
                templateUrl: 'views/login.html'
                // templateUrl: 'views/menu.html'
            })
            .state('chat', {
                url: '/chat',
                controller: 'chatCtrl',
                templateUrl: 'views/chatbot.html'
            })
            .state('property', {
                url: '/properties',
                controller: 'propertyCtrl',
                templateUrl: 'views/property.html'
            })
            .state('vehicles', {
                url: '/vehicles',
                controller: 'vehicleCtrl',
                templateUrl: 'views/vehicle.html'
            })
            .state('googleDrive', {
                url: '/google-drive',
                templateUrl: 'views/googleDrive.html'
            })

            .state('chatbots', {
                url: '/chatbots',
                templateUrl: 'views/chatbots.html'
            })


    }])





