angular.module('stereoSurf.eventDetail', [])

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
        function ($scope, $ionicModal, $sce, $stateParams) {

            // init state
            var detailState = {currentTab: "quality", isAnalyseMode: "false"};
            $scope.detailState = detailState;
            $scope.videoConfig = createVideoConfig();
            $scope.exampleData = createExampleChartData();
            $scope.currentEventId = $stateParams.eventId;

            createModal();

            // exposed methods
            $scope.activateDetailView = activateDetailView;
            $scope.toggleAnalyseMode = toggleAnalyseMode;
            $scope.onPlayerReady = onPlayerReady;
            $scope.playVideo = playVideo;
            $scope.incrementVideoByOne = incrementVideoByOne;
            $scope.decrementVideoByOne = decrementVideoByOne;
            $scope.newBookmark = newBookmark;
            $scope.closeNewBookmark = closeNewBookmark;

            //events
            $scope.$on('$destroy', function () {
                $scope.modal.remove();
            });
            // Execute action on hide modal
            $scope.$on('modal.hidden', function () {
                // Execute action
            });
            // Execute action on remove modal
            $scope.$on('modal.removed', function () {
                // Execute action
            });

            $scope.xAxisTickFormatFunction = function(value) {
                var out = ''+value;
                if(out.length > 4) {
                    out = out.substr(0,4);
                }
                return out;
            }

            function createVideoConfig() {

                var videoConfig = {
                    sources: [
                        {
                            src: $sce.trustAsResourceUrl("/img/output.mp4"),
                            type: "video/mp4"
                        }
                    ],
                    tracks: [
                        {
                            src: "http://www.videogular.com/assets/subs/pale-blue-dot.vtt",
                            kind: "subtitles",
                            srclang: "en",
                            label: "English",
                            default: ""
                        }
                    ],
                    theme: "lib/videogular-themes-default/videogular.css",
                    plugins: {
                        poster: "http://www.videogular.com/assets/images/videogular.png"
                    }
                };

                return videoConfig;
            }

            function createExampleChartData() {

                var exampleChartData = JSON.parse(JSON.stringify(myChartData));

                var currentTime = 0;
                if($scope.videoApi)
                    currentTime = $scope.videoApi.currentTime / 1000;

                var values = exampleChartData.values;
                var newValues = [];

                var minTime = currentTime - 1;
                var maxTime = currentTime + 1;

                for(var i = 0; i < values.length; i++) {
                    var value = values[i];
                    if(value.x >= minTime && value.x <= maxTime) {
                        newValues.push(value);
                    }
                }

                exampleChartData.values = newValues;

                return [exampleChartData];
            }


            function newBookmark() {

                $scope.modal.show();
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
            }


            function onPlayerReady(API) {
                console.log(API);
                $scope.videoApi = API;

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
            }

            function decrementVideoByOne() {


                var currentTime = $scope.videoApi.currentTime / 1000;
                $scope.videoApi.seekTime(currentTime - 1, false);

            }

            function activateDetailView(viewName) {


                detailState.currentTab = viewName;
            }


        }]);


