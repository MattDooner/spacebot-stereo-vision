angular.module('stereoSurf.eventOverview', [])

    .config(function ($stateProvider) {
        $stateProvider


            .state('app.event-overview', {
                url: "/event",

                views: {
                    'menuContent': {
                        templateUrl: "js/eventOverview/partials/event-overview.html",
                        controller: 'EventOverviewCtrl'

                    }
                }
            })
    })

    .controller('EventOverviewCtrl', ['$scope', function ($scope) {



    }]);