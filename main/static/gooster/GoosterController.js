(function(){
    'use strict';
    angular.module('app', [])
        .controller('GoosterController', ['$scope', '$http', '$window', goosterController]);
    function goosterController($scope, $http, $window){
        $scope.menuItems = [];

        var map, infoWindow;

        $window.initMap = function() {
            map = new google.maps.Map(document.getElementById('map'), {
                center: {lat: 47.1713741, lng: 27.5720664},
                zoom: 15
            });

            infoWindow = new google.maps.InfoWindow;

            // Try HTML5 geolocation.
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    var pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    map.setCenter(pos);

                    // Create markerW
                    var marker = new google.maps.Marker({
                        map: map,
                        position: pos,
                        animation: google.maps.Animation.DROP
                    });

                    // Add circle overlay and bind to marker
                    var circle = new google.maps.Circle({
                        map: map,
                        radius: 855,
                        fillColor: 'green'
                    });
                    circle.bindTo('center', marker, 'position');

                    var service = new google.maps.places.PlacesService(map);
                    service.nearbySearch({
                        location: pos,
                        radius: 855,
                        type: ['store', 'hotel']
                    }, callback);

                    // queryPlaces(pos);

                }, function() {
                    handleLocationError(true, infoWindow, map.getCenter());
                });
            } else {
                // Browser doesn't support Geolocation
                handleLocationError(false, infoWindow, map.getCenter());
            }
        }

        // function queryPlaces(pos){
        //     $http({
        //         'method': "GET",
        //         'url': "https://maps.googleapis.com/maps/api/place/nearbysearch/json?radius=850&location="+
        //         pos.lat + "," + pos.lng + 'key=AIzaSyCjdSb7G5wboVeGG-e6YLbj_DyRsHswwB8',
        //
        //     }).then(function(res){
        //         console.log(res);
        //     }, function(err){
        //         console.log(err);
        //     });
        // }

        function handleLocationError(browserHasGeolocation, infoWindow, pos) {
            infoWindow.setPosition(pos);
            infoWindow.setContent(browserHasGeolocation ?
                'Error: The Geolocation service failed.' :
                'Error: Your browser doesn\'t support geolocation.');
            infoWindow.open(map);
        }

        function callback(results, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                console.log(results);
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
                scaledSize: new google.maps.Size(25, 25)
            };
            var marker = new google.maps.Marker({
                map: map,
                position: placeLoc,
                animation: google.maps.Animation.DROP,
                icon: image
            });
        }
    }
})();
