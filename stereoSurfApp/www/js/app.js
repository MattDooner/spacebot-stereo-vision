// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('stereoSurf', ['ionic',
    "ngCordova",
    "stereoSurf.eventDetail",
    "stereoSurf.eventOverview",
    "com.2fdevs.videogular",
    "com.2fdevs.videogular.plugins.controls",
    "com.2fdevs.videogular.plugins.overlayplay",
    "com.2fdevs.videogular.plugins.poster",
    "ngSanitize"
])

    .run(function ($ionicPlatform, $cordovaStatusbar, $cordovaSplashscreen, $timeout) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleLightContent();

            }


            $cordovaSplashscreen.hide();


        });
    })

    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider

            .state('app', {
                url: "/app",
                abstract: true,
                templateUrl: "templates/menu.html",
                controller: 'MainViewCtrl'
            })


            .state('app.event-drilldown', {
                url: "/event/:eventId/drilldown",
                views: {
                    'menuContent': {
                        templateUrl: "templates/event-drilldown.html"
                    }
                }
            });


        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/app/event');
    })

    .controller('MainViewCtrl', ['$scope', 'EventsService', function ($scope, EventsService) {


        $scope.events = EventsService.events;


    }]);
