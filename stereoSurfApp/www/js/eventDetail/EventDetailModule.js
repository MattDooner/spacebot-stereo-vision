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
        'EventsService',
        '$timeout',
        function ($scope, $ionicModal, $sce, $stateParams, EventsService,$timeout) {

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


            function persistNewBookmark() {


                var eventToPersist =
                {
                    eventId: EventsService.getNextId(),
                    currentTime: $scope.videoApi.currentTime /1000,
                    notes: $scope.newBookmarkState.eventNotes,
                    eventName: $scope.newBookmarkState.eventName,
                    hidden: false
                };

                EventsService.addEvent(eventToPersist);
                closeNewBookmark();

            }

            function createVideoConfig() {

                var videoConfig = {
                    sources: [
                        {
                            src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.mp4"),
                            type: "video/mp4"
                        },
                        {
                            src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.webm"),
                            type: "video/webm"
                        },
                        {
                            src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.ogg"),
                            type: "video/ogg"
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

                var exampleChartData = [
                    {
                        "key": "Group 0",
                        "values": [{
                            "x": 0.1905653578931545,
                            "y": 0.8115218253543552,
                            "size": 0.3461829945445061
                        }, {
                            "x": -0.47275546081985614,
                            "y": -0.21250610156481783,
                            "size": 0.7597237343434244
                        }, {
                            "x": -0.5943608400643436,
                            "y": 0.48326260219425793,
                            "size": 0.02735756477341056
                        }, {
                            "x": 0.4529497407477123,
                            "y": -0.2613829468206304,
                            "size": 0.946700036060065
                        }, {
                            "x": -0.7679040328935364,
                            "y": -1.586936005594271,
                            "size": 0.43301939661614597
                        }, {
                            "x": -1.5731902534071192,
                            "y": -0.09195950915659948,
                            "size": 0.4368209659587592
                        }, {
                            "x": 0.05553592818277685,
                            "y": 1.742933013062792,
                            "size": 0.8306681548710912
                        }, {
                            "x": 1.1877814988973527,
                            "y": -1.3711119089602777,
                            "size": 0.8269749800674617
                        }, {
                            "x": 0.3064363198255656,
                            "y": -1.667839553436299,
                            "size": 0.12198411440476775
                        }, {
                            "x": -1.8983536631939086,
                            "y": -0.30140817421374505,
                            "size": 0.9157399751711637
                        }, {
                            "x": 0.8488366723521106,
                            "y": 1.295855799517563,
                            "size": 0.962707610335201
                        }, {
                            "x": 0.04917381379553963,
                            "y": 0.1181675943613078,
                            "size": 0.6471372074447572
                        }, {
                            "x": 0.7289245491658888,
                            "y": -1.437523544728938,
                            "size": 0.11755557032302022
                        }, {
                            "x": 0.5629218945450293,
                            "y": -0.006342726461880527,
                            "size": 0.4649628330953419
                        }, {
                            "x": 0.8000392538355794,
                            "y": -0.5021601017044044,
                            "size": 0.6989645406138152
                        }, {
                            "x": -0.023370322333300483,
                            "y": 1.1371358097794941,
                            "size": 0.6258520961273462
                        }, {
                            "x": 0.7532529820424834,
                            "y": -1.5173273652093129,
                            "size": 0.8538876241073012
                        }, {
                            "x": 1.9112037262708281,
                            "y": -0.9995548189037156,
                            "size": 0.9963174634613097
                        }, {
                            "x": 0.9789011739485827,
                            "y": -0.9841778566713231,
                            "size": 0.7415103658568114
                        }, {
                            "x": -0.7347622707954421,
                            "y": 0.4025962928769507,
                            "size": 0.6174976546317339
                        }, {
                            "x": -0.5613983233476523,
                            "y": 0.39581568123378746,
                            "size": 0.26463790889829397
                        }, {
                            "x": -0.05388729078366278,
                            "y": 0.6683711793675684,
                            "size": 0.10974680096842349
                        }, {
                            "x": 1.6831239036269066,
                            "y": -1.0049660895776276,
                            "size": 0.24276677169837058
                        }, {
                            "x": 0.5270582634376473,
                            "y": -0.5988214257540422,
                            "size": 0.5567773135844618
                        }, {
                            "x": -0.5240116462616992,
                            "y": 1.146009958570413,
                            "size": 0.006196586648002267
                        }, {
                            "x": -0.20812125647497828,
                            "y": 0.6996467377096869,
                            "size": 0.7625449288170785
                        }, {
                            "x": 0.3697092607468307,
                            "y": -0.561916499254294,
                            "size": 0.8315129862166941
                        }, {
                            "x": 0.19189187887399817,
                            "y": -0.2128728937328294,
                            "size": 0.2983735257294029
                        }, {
                            "x": 0.7179505100531616,
                            "y": 0.6074982425906404,
                            "size": 0.9714579060673714
                        }, {
                            "x": -1.0258042397131446,
                            "y": 0.028916435404879495,
                            "size": 0.9255245921667665
                        }, {
                            "x": 0.049858130491165054,
                            "y": 0.16023668632367177,
                            "size": 0.24754037684760988
                        }, {
                            "x": -0.4480373145257009,
                            "y": -0.6809428379549302,
                            "size": 0.3886829293332994
                        }, {
                            "x": -2.2812991513382728,
                            "y": -0.33079294312596536,
                            "size": 0.9202477361541241
                        }, {
                            "x": 0.8451574891358427,
                            "y": 0.7672813961466449,
                            "size": 0.5153329856693745
                        }, {
                            "x": 0.9093939178973485,
                            "y": -0.6761728190553149,
                            "size": 0.782141275703907
                        }, {
                            "x": 2.1503140852060727,
                            "y": -0.9199074184181212,
                            "size": 0.18787955376319587
                        }, {
                            "x": -0.8493702928940353,
                            "y": -1.9134660420041427,
                            "size": 0.9342464371584356
                        }, {
                            "x": 1.8426928208903286,
                            "y": -1.2276238838923101,
                            "size": 0.7361447520088404
                        }, {
                            "x": -1.6394957638842569,
                            "y": 1.1874215522015235,
                            "size": 0.03339804639108479
                        }, {"x": -0.16743144480987487, "y": -1.3360786878739637, "size": 0.17817910155281425}]
                    }

                ];

                return exampleChartData;
            }


            function setStateFromBookmark() {

                var bookmark = EventsService.getEventById($scope.currentEventId);

                if (bookmark && !bookmark.hidden) {

                    $scope.videoApi.seekTime(bookmark.currentTime);


                    $timeout(function(){

                        $scope.videoApi.pause();

                    })

                }


            }

            function showBookmarkDialog() {


                if (!($scope.videoApi.currentState === 'play' || $scope.videoApi.currentState === 'stop')) {

                    $scope.modal.show();

                }
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
                $scope.videoApi = API;


                // do this after player ready as it needs api access to seek to bookmark
                setStateFromBookmark();

            }

            function toggleAnalyseMode() {

                detailState.isAnalyseMode = !detailState.isAnalyseMode;

                if (detailState.isAnalyseMode) {

                    pauseVideo();
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


