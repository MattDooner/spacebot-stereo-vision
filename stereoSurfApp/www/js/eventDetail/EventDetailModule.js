angular.module('stereoSurf.eventDetail', ["nvd3"])

    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider


            .state('app.event', {
                url: "/event/:eventId",

                views: {
                    'menuContent': {
                        templateUrl: "js/eventDetail/partials/event-detail.html",
                        controller: 'EventDetailCtrl'

                    }
                }
            })

    })


    .controller('EventDetailCtrl',
    ['$scope',
        '$ionicModal',
        '$sce',
        '$stateParams',
        'EventsService',
        '$timeout',
        '$rootScope',
        '$ionicScrollDelegate',
        function ($scope, $ionicModal, $sce, $stateParams, EventsService, $timeout, $rootScope,$ionicScrollDelegate) {

            // init state
            var detailState = {currentTab: "quality", isAnalyseMode: "false"};
            var newBookmarkState = {};

            $scope.detailState = detailState;
            $scope.newBookmarkState = newBookmarkState;
            $scope.exampleData = createExampleChartData();
            $scope.videoConfig = createVideoConfig();
            $scope.currentEventId = $stateParams.eventId;

            createModal();

            // exposed methods
            $scope.activateDetailView = activateDetailView;
            $scope.toggleAnalyseMode = toggleAnalyseMode;
            $scope.onPlayerReady = onPlayerReady;
            $scope.playVideo = playVideo;
            $scope.incrementVideoByOne = incrementVideoByOne;
            $scope.decrementVideoByOne = decrementVideoByOne;
            $scope.showBookmarkDialog = showBookmarkDialog;
            $scope.closeNewBookmark = closeNewBookmark;
            $scope.persistNewBookmark = persistNewBookmark;
            $scope.prepareBookmarkVideoView = prepareBookmarkVideoView;
            $scope.updatePositionRecord = updatePositionRecord;


            var nvd3TooltipFormat = d3.format(',.4f');

            // chart
            $scope.nvd3Options = {
                chart: {
                    type: "scatterChart",
                    height: "300",
                    width: "800",

                    tooltipContent: function (key, xlab, ylab, data) {
                        var fmt = nvd3TooltipFormat;
                        return 'μ=' + fmt(data.point.y) + '<br>σ=' + fmt(data.point.size);
                    },

                    xAxis: {
                        "axisLabel": "Time (sec)",
                        tickFormat: function (d) {
                            return d3.format(',.1f')(d);
                        }
                    },

                    yAxis: {
                        "axisLabel": "Mean Match Error",
                        tickFormat: function (d) {
                            return d3.format(',.2f')(d);
                        }
                    },

                    dispatch: {
                        tooltipShow: function (e) {
                            $scope.videoApi.seekTime(e.point.x, false);
                        }
                    },

                    // TODO: set max and min from the dataset
                    forceY: [0, .5]
                }
            }

            //events
            $scope.$on('$destroy', function () {
                $scope.modal.remove();
            });

            // Execute action on hide modal
            $scope.$on('modal.hidden', function () {
                $scope.newBookmarkState = {};
            });

            // Execute action on remove modal
            $scope.$on('modal.removed', function () {
                // Execute action
            });

            $rootScope.$on('$stateChangeSuccess',
                function (event, toState, toParams, fromState, fromParams) {

                    console.log("updating from bookmark");
                    setStateFromBookmark();

                });

            // chart stuff

            function persistNewBookmark() {

                var eventToPersist =
                {
                    eventId: EventsService.getNextId(),
                    currentTime: $scope.videoApi.currentTime / 1000,
                    notes: $scope.newBookmarkState.eventNotes,
                    eventName: $scope.newBookmarkState.eventName,
                    hidden: false
                };

                EventsService.addEvent(eventToPersist);
                closeNewBookmark();

            }

            $scope.$on('elementMouseover.tooltip.directive', function (angularEvent, event) {
                console.log('Element mouseover! ');
                console.log(angularEvent);
                console.log(event);
                $scope.videoApi.seekTime(event.point.x, false);
            });

            function createVideoConfig() {

                var videoConfig = {
                    sources: [
                        {
                            src: $sce.trustAsResourceUrl("img/output.mp4"),
                            type: "video/mp4"
                        }
                    ],
                    theme: "lib/videogular-themes-default/videogular.css"
                };

                return videoConfig;
            }

            function createExampleChartData() {

                var exampleChartData = JSON.parse(JSON.stringify(myChartData));

                var currentTime = 0;
                if ($scope.videoApi)
                    currentTime = $scope.videoApi.currentTime / 1000;

                var values = exampleChartData.values;
                var newValues = [];

                var minTime = currentTime - 1;
                var maxTime = currentTime + 1;

                for (var i = 0; i < values.length; i++) {
                    var value = values[i];
                    if (value.x >= minTime && value.x <= maxTime) {
                        newValues.push(value);
                    }
                }

                exampleChartData.values = newValues;

                return [exampleChartData];
            }


            function setStateFromBookmark() {

                var bookmark = EventsService.getEventById($scope.currentEventId);

                if (bookmark && !bookmark.hidden) {

                    $timeout(function () {

                        $scope.videoApi.pause();
                        $scope.videoApi.seekTime(bookmark.currentTime);
                        $scope.exampleData = createExampleChartData();
                    })
                }
            }

            function showBookmarkDialog() {


                if (!($scope.videoApi.currentState === 'play' || $scope.videoApi.currentState === 'stop')) {

                    $scope.modal.show();

                    $timeout(function(){

                        var bookmark = EventsService.getEventById($scope.currentEventId);
                        var bookmarkVideoSnapshotHandle = $ionicScrollDelegate.$getByHandle('bookmark-preview-scroll');

                        if (bookmark && bookmark.hidden) {

                            bookmarkVideoSnapshotHandle.zoomTo(1.25,false);
                            bookmarkVideoSnapshotHandle.scrollTo(90,90,false);

                        }

                        $scope.currentBookmarkVidScrollPos =  bookmarkVideoSnapshotHandle.getScrollPosition();
                        var currentTime = $scope.videoApi.currentTime / 1000;
                        $scope.currentActiveBookmarkVideoApi.seekTime(currentTime, false);

                    })

                }
            }

            function updatePositionRecord(){

                $timeout(function() {
                    $scope.currentBookmarkVidScrollPos = $ionicScrollDelegate.$getByHandle('bookmark-preview-scroll').getScrollPosition();
                });
            }

            function closeNewBookmark() {

                $scope.modal.hide();
            }

            function createModal() {

                $ionicModal.fromTemplateUrl('js/eventDetail/bookmark/partial/bookmark.html', {
                    scope: $scope,
                    animation: 'slide-in-up'
                }).then(function (modal) {
                    $scope.modal = modal;
                });

            }

            function playVideo() {

                $scope.videoApi.play();
            }


            function pauseVideo() {
                $scope.videoApi.pause();
                $scope.oldCurrentTime = $scope.videoApi.currentTime / 1000;
            }


            function onPlayerReady(API) {

                $scope.videoApi = API;

                // do this after player ready as it needs api access to seek to bookmark
                setStateFromBookmark();

            }

            function toggleAnalyseMode() {

                detailState.isAnalyseMode = !detailState.isAnalyseMode;

                if (detailState.isAnalyseMode) {

                    pauseVideo();
                    $scope.exampleData = createExampleChartData();
                } else {

                    //resume playback
                    playVideo();
                }

            }

            function incrementVideoByOne() {


                var currentTime = $scope.videoApi.currentTime / 1000;
                $scope.videoApi.seekTime(currentTime + 1, false);
                $scope.exampleData = createExampleChartData();
            }

            function decrementVideoByOne() {


                var currentTime = $scope.videoApi.currentTime / 1000;
                $scope.videoApi.seekTime(currentTime - 1, false);
                $scope.exampleData = createExampleChartData();

            }

            function activateDetailView(viewName) {


                detailState.currentTab = viewName;
            }


            function prepareBookmarkVideoView($API){

                $scope.currentActiveBookmarkVideoApi = $API;

            }

        }]);


