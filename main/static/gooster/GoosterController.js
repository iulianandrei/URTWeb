(function(){
    'use strict';
    angular.module('app')
        .controller('GoosterController', ['$scope', '$http', '$window', goosterController]);
    function goosterController($scope, $http, $window){
        $scope.markers_array = [];
        $scope.showPlacesTypes = true;
        var infoWindow;

        $window.initMap = function() {
            $scope.directionsDisplay = new google.maps.DirectionsRenderer();

            $scope.map = new google.maps.Map(document.getElementById('map'), {
                zoom: 17
            });

            infoWindow = new google.maps.InfoWindow;

            // Try HTML5 geolocation.
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    $scope.pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    $scope.map.setCenter($scope.pos);

                    var marker = new google.maps.Marker({
                        map: $scope.map,
                        position: $scope.pos,
                        animation: google.maps.Animation.DROP
                    });

                    // Add circle overlay and bind to marker
                    var circle = new google.maps.Circle({
                        map: $scope.map,
                        radius: 500,
                        fillColor: 'green'
                    });
                    circle.bindTo('center', marker, 'position');

                }, function() {
                    handleLocationError(true, infoWindow, $scope.map.getCenter());
                });
            } else {
                // Browser doesn't support Geolocation
                handleLocationError(false, infoWindow, $scope.map.getCenter());
            }
        };

        $scope.setPlaces = function(){
            $scope.directionsDisplay.setMap(null);
            if($scope.place_service){
                _.each($scope.markers_array, function(marker, index){
                    marker.setMap(null);
                });
                $scope.markers_array = [];
            } else{
                $scope.place_service = new google.maps.places.PlacesService($scope.map);
            }

            $scope.place_service.nearbySearch({
                location: $scope.pos,
                radius: 500,
                types: _.chain($scope.list_of_places).filter('check', true).map('code').value()
            }, callback);
        };

        $scope.selectPlaceToGo = function(place_to_go){
            var latitude = place_to_go.geometry.location.lat();
            var longitude = place_to_go.geometry.location.lng();
            $scope.destination = {
                lat: latitude,
                lng: longitude
            };
            calcRoute();
        };

        $scope.addPlaceToFavorites = function(place_id){
            $http({
                'method': 'POST',
                'url': 'http://localhost:8000',
                'data': place_id
            }).then(function(){}, function(){});
        };

        function handleLocationError(browserHasGeolocation, infoWindow, pos){
            infoWindow.setPosition(pos);
            infoWindow.setContent(browserHasGeolocation ?
                'Error: The Geolocation service failed.' :
                'Error: Your browser doesn\'t support geolocation.');
            infoWindow.open($scope.map);
        }

        function callback(results, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                console.log(results);
                $scope.places_in_proximity = results;
                console.log($scope.showPlacesTypes);
                $scope.showPlacesTypes = false;
                $scope.$apply();
                console.log($scope.showPlacesTypes);
                for (var i = 0; i < results.length; i++) {
                    createMarker(results[i]);
                }
            }
        }

        function createMarker(place) {
            var placeLoc = place.geometry.location;
            var image = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(30, 30)
            };
            var marker = new google.maps.Marker({
                map: $scope.map,
                position: placeLoc,
                animation: google.maps.Animation.DROP,
                icon: image
            });

            console.log(place.name);
            var infoWindow = new google.maps.InfoWindow({
                content: '<div style="color: #000;">' + place.name + '</div>'
            });

            $scope.markers_array.push(marker);

            google.maps.event.addListener(marker, "click", function (event) {
                var latitude = event.latLng.lat();
                var longitude = event.latLng.lng();
                $scope.destination = {
                    lat: latitude,
                    lng: longitude
                };
                calcRoute();
            });

            google.maps.event.addListener(marker, "mouseover", function (event) {
                infoWindow.open($scope.map, marker);
            });
            google.maps.event.addListener(marker, "mouseout", function (event) {
                infoWindow.close();
            });
        }

        function calcRoute() {
            $scope.directionsDisplay.setMap(null);
            $scope.directionsDisplay.setMap($scope.map);

            var directionsService = new google.maps.DirectionsService();
            console.log($scope.pos);
            console.log($scope.destination);
            var request = {
                origin: $scope.pos,
                destination: $scope.destination,
                travelMode: google.maps.TravelMode.WALKING
            };

            directionsService.route(request, function(response, status) {
                if (status === google.maps.DirectionsStatus.OK) {
                    $scope.directionsDisplay.setDirections(response);
                    $scope.directionsDisplay.setMap($scope.map);
                } else {
                    alert("Directions Request from " + start.toUrlValue(6) + " to " + end.toUrlValue(6) + " failed: " + status);
                }
            });
        }


        $scope.list_of_places = [
            {
                location: 'Mall',
                check: false,
                code: 'shopping_mall'
            },
            {
                location: 'Airport',
                check: false,
                code: 'airport'
            },
            {
                location: 'Academic',
                check: false,
                code: 'school'
            },
            {
                location: 'Food',
                check: false,
                code: 'restaurant'

            },
            {
                location: 'Beauty salon',
                check: false,
                code: 'beauty_salon'
            },
            {
                location: 'Supermarket',
                check: false,
                code: 'convenience_store'
            },
            {
                location: 'Drink',
                check: false,
                code: 'bar'
            },
            {
                location: 'Caffeteria',
                check: false,
                code: 'cafe'
            },
            {
                location: 'Car Wash',
                check: false,
                code: 'car_wash'
            },
            {
                location: 'Hospital',
                check: false,
                code: 'hospital'
            },
            {
                location: 'Police',
                check: false,
                code: 'police'
            },
            {
                location: 'Cemetery',
                check: false,
                code: 'cemetery'
            },
            {
                location: 'Auto Service',
                check: false,
                code: 'car_repair'
            },
            {
                location: 'Gas Station',
                check: false,
                code: 'gas_station'
            },
            {
                location: 'Hotels',
                check: false,
                code: 'funeral_home'
            },
            {
                location: 'Parking Lot',
                check: false,
                code: 'park'
            },
            {
                location: 'Banks',
                check: false,
                code: 'bank'
            },
            {
                location: 'ATM',
                check: false,
                code: 'atm'
            },
            {
                location: 'Taxi',
                check: false,
                code: 'taxi_stand'
            },
            {
                location: 'Stadium',
                check: false,
                code: 'stadium'
            },
            {
                location: 'Pharmacy',
                check: false,
                code: 'pharmacy'
            },
            {
                location: 'Train',
                check: false,
                code: 'train_station'
            },
            {
                location: 'Post Office',
                check: false,
                code: 'post_office'
            },
            {
                location: 'Club',
                check: false,
                code: 'night_club'
            },
            {
                location: 'Parks',
                check: false,
                code: 'park'
            },
            {
                location: 'Churches',
                check: false,
                code: 'church'
            },
            {
                location: 'Museums',
                check: false,
                code: 'museum'
            }
        ];

        $scope.list_of_places = _.orderBy($scope.list_of_places, 'location');
    }
})();
