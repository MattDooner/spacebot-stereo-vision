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

    .controller('EventOverviewCtrl', ['$scope','$cordovaSplashscreen','$ionicPlatform', function ($scope,$cordovaSplashscreen,$ionicPlatform) {

        $ionicPlatform.ready(function () {

            $cordovaSplashscreen.hide();
        });
    }])

    .factory('EventsService', function () {

        var EventsService = {};

        EventsService.events = [];
        initEvents();

        // expose public methods
        EventsService.addEvent = addEvent;
        EventsService.getEventById = getEventById;
        EventsService.getNextId = getNextId;

        function addEvent(event){

            EventsService.events.push(event);
        }

        function initEvents(){

            var firstEmptyEvent = {eventId:1, currentTime: 0, notes: "", eventName:"", hidden: true};
            addEvent(firstEmptyEvent);

        }

        function getEventById(searchEventId){

            return _.findWhere(EventsService.events, {eventId:parseInt(searchEventId)});

        }

        function getNextId(){

            var idList = _.pluck(EventsService.events,'eventId');
            var lastId = _.max(idList);

            return lastId +1;

        }

        return EventsService;

    });