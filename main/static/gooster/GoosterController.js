(function(){
    'use strict';
    angular.module('app')
        .controller('GoosterController', ['$scope', '$http', '$window', goosterController]);
    function goosterController($scope, $http, $window){
        if(localStorage.getItem('user_email') == null){
            $window.location.href = "http://localhost:8000/login/";
        } else{
            $scope.user_prefs = [];
            getCurrentUserPrefs();
        }
        $scope.gooster_sad = false;
        $scope.markers_array = [];
        $scope.showPlacesTypes = true;
        var infoWindow;
        // initializare harta
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

                    //marcarea cu pin a pozitiei curente
                    var marker = new google.maps.Marker({
                        map: $scope.map,
                        position: $scope.pos,
                        animation: google.maps.Animation.DROP
                    });

                    // crearea razei in jurul pozitiei curente
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

        // lista de locuri favorite
        $scope.addPlaceToFavorites = function(place, event){
            event.stopPropagation();
            if(place.hasOwnProperty('favorite') && place.favorite === true){
                deletePlaceFromFavorites(place);
                return;
            }
            //Trimitere JSON cu preferinte
            $http({
                'method': 'POST',
                'url': 'http://localhost:8000/api/users/addprefs',
                'data': JSON.stringify({'email': localStorage.getItem('user_email'), 'prefs': place.place_id})
            }).then(function(res){
                console.log(res);
                place.favorite = true;
                $scope.user_prefs.push(place.place_id);
            }, function(err){
                place.favorite = false;
                console.log(err);
            });
        };
        //logout
        $scope.logout = function(){
            localStorage.clear();
            $window.location.href = "http://localhost:8000/login/";
        };

        //top 5 cele mai populare locuri vizitate de catre utilizatorii aplicatiei
        $scope.getTop5PopularLocations = function(){
            $http({
                'method': 'GET',
                'url': 'http://localhost:8000/api/users/gettop'
            }).then(function(res){
                $scope.gooster_sad=false;
                console.log(res);
                var found = false;
                var place_ids_array = [];
                _.forIn(res.data.data, function(value, key){
                    place_ids_array.push(key);
                });
                console.log(place_ids_array);
                _.each(place_ids_array, function(place_id){
                    var service = new google.maps.places.PlacesService($scope.map);
                    service.getDetails({'placeId': place_id}, function(place){

                        //verificarea daca cele mai vizitate locuri se afla in raza utilizatorului curent
                        if(place!= null && Math.sqrt(Math.pow($scope.pos.lat - place.geometry.location.lat(), 2)
                                + Math.pow($scope.pos.lng - place.geometry.location.lng(), 2)) < 500){
                            found = true;
                            createMarker(place);
                        }
                    });
                });
                return found;
            }, function(err){
                $scope.gooster_sad=true;
                console.log(err);

                return false;
            });
        };

        // stergerea unui loc favorit
        function deletePlaceFromFavorites(place){
            $http({
                'method': 'POST',
                'url': 'http://localhost:8000/api/users/delpref',
                'data': JSON.stringify({'email': localStorage.getItem('user_email'), 'pref': place.place_id})
            }).then(function(res){
                console.log(res);
                place.favorite = false;
                var array = [];
                _.each($scope.user_prefs, function(pref_place_id, index){
                   if(pref_place_id === place.place_id){
                       array = $scope.user_prefs.splice(index, 1);
                       return false;
                   }
                });
                $scope.user_prefs = array;
            }, function(err){console.log(err);});
        }

        // obtinerea listei de preferinte a unui utilizator
        function getCurrentUserPrefs(){
            $http({
               method: 'POST',
                url: 'http://localhost:8000/api/users/getprefs',
                data : JSON.stringify({'email': localStorage.getItem('user_email')}),
                headers:{"Access-Control-Allow-Origin":" *"}
            }).then(
                function(res){
                    console.log(res);
                    $scope.user_prefs = res.data.prefs;
                },
                function(err){
                    console.log(err);
                }
            );
        }

        // rezolvarea erorilor de localizare
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
                verifyIfHasFavorites(results);
                $scope.places_in_proximity = results;
                $scope.showPlacesTypes = false;
                $scope.$apply();
                console.log($scope.showPlacesTypes);
                for (var i = 0; i < results.length; i++) {
                    createMarker(results[i]);
                }
            }
        }

        function verifyIfHasFavorites(results_array){
            _.each(results_array, function(place){
                var fav_place = _.find($scope.user_prefs, function(pref_id){
                    return pref_id == place.place_id;
                });
                if(fav_place !== undefined){
                    place.favorite = true;
                }
            });
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
