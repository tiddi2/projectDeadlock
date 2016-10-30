var userid, displayName, email, photoURL
var mellomstoppFraDatabase;
const waypoints = firebase.database().ref("waypoints")
firebase.auth().onAuthStateChanged(firebaseUser => {
    if (firebaseUser) {

        const provider = new firebase.auth.GoogleAuthProvider();


        //var carPicture or number
        waypoints.on('child_added', function(snap) {
            mellomstoppFraDatabase = snap.child("waypoints").val()
        });

        userid = firebase.auth().currentUser.uid
        displayName = firebase.auth().currentUser.displayName
        email = firebase.auth().currentUser.email
        photoURL = firebase.auth().currentUser.photoURL
    } else {
        console.log("Ikke innlogget")
        window.location.href ="../login.html"
    }
});


function initMap() {
    var userPos = null;
    var origin_place_id = null;
    var destination_place_id = null;
    var travel_mode = 'DRIVING';
    var map = new google.maps.Map(document.getElementById('map'), {
        mapTypeControl: false,
        center: {
            lat: 59.2026663,
            lng: 11.1652335
        },
        zoom: 11
    });

    var geocoder = new google.maps.Geocoder;
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;
    var infoWindow = new google.maps.InfoWindow({
        map: map
    });

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            userPos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            function geocodeLatLng(geocoder, map, infoWindow, startPosition, lat, lng) {
                var latlng = {
                    lat: lat,
                    lng: lng
                };
                geocoder.geocode({
                    'location': latlng
                }, function(results, status) {
                    if (status === 'OK') {
                        if (results[0]) {
                            infoWindow.setContent(results[0].formatted_address);
                            startPosition.value = results[0].formatted_address;
                        }
                        else if (results[1]) {
                            infoWindow.setContent(results[1].formatted_address);
                            startPosition.value = results[1].formatted_address;
                        }
                        else {
                            console.log("no results found");
                        }
                    } else {
                        console.log('Geocoder failed due to: ' + status)
                    }
                });
            }

            infoWindow.setPosition(userPos);
            infoWindow.setContent(geocodeLatLng(geocoder, map, infoWindow, origin_input, userPos.lat, userPos.lng));
            map.setCenter(userPos);
        }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }

    function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        //infoWindow.setPosition(pos);
        //infoWindow.setContent(browserHasGeolocation ?
        //    'Error: The Geolocation service failed.' :
        //    'Error: Your browser doesn\'t support geolocation.');
    }



    directionsDisplay.setMap(map);
    var confirm_route = document.getElementById("confirmRoute")
    var origin_input = document.getElementById('origin-input');
    var destination_input = document.getElementById('destination-input');
    confirm_route.onclick = collectData
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(origin_input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(destination_input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(confirm_route);

    var origin_autocomplete = new google.maps.places.Autocomplete(origin_input);
    origin_autocomplete.bindTo('bounds', map);
    var destination_autocomplete = new google.maps.places.Autocomplete(destination_input);
    destination_autocomplete.bindTo('bounds', map);
    function collectData() {
        const driverId = userid
        const arrivalTime = (new Date()).toString() //skal bli utfyllt automatisk,
        const acceptedDetour = 30
        const driverName = displayName
        const startPlace = origin_input.value
        const stopPlace = destination_input.value
        if(startPlace !== "" && stopPlace !== "") {
            saveRouteToDatabase(driverId,arrivalTime,acceptedDetour,driverName,startPlace,stopPlace)
            origin_input.value = "";
            destination_input.value = "";
        }
    }

    function saveRouteToDatabase(driverId,DriverArriveStopTime,acceptedDetour,driverName,startPlace,stopPlace){
        const drives = firebase.database().ref("kjoreturer/" + driverId + "/Drives")

        var newPostRef = drives.push();
        newPostRef.set({
            DriverArriveStopTime: DriverArriveStopTime,
            acceptedDetour: acceptedDetour,
            driverName: driverName,
            startPlace: startPlace,
            stopPlace: stopPlace

        });

    }

    function expandViewportToFitPlace(map, place) {
        if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
        } else {
            map.setCenter(place.geometry.location);
            map.setZoom(17);
        }
    }

    origin_autocomplete.addListener('place_changed', function() {
        console.log("START CHANGED")
        var place = origin_autocomplete.getPlace();
        if (!place.geometry) {
            window.alert("Autocomplete's returned place contains no geometry");
            return;
        }
        expandViewportToFitPlace(map, place);

        // If the place has a geometry, store its place ID and route if we have
        // the other place ID
        origin_place_id = place.place_id;
        route(origin_place_id, destination_place_id, travel_mode,
            directionsService, directionsDisplay);
    });

    destination_autocomplete.addListener('place_changed', function() {
        console.log("Destinatiopn CHANGED")
        var place = destination_autocomplete.getPlace();
        if (!place.geometry) {
            window.alert("Autocomplete's returned place contains no geometry");
            return;
        }
        expandViewportToFitPlace(map, place);

        // If the place has a geometry, store its place ID and route if we have
        // the other place ID
        destination_place_id = place.place_id;
        route(origin_place_id, destination_place_id, travel_mode,
            directionsService, directionsDisplay);
    });

    function route(origin_place_id, destination_place_id, travel_mode,
        directionsService, directionsDisplay) {
        if (!origin_place_id || !destination_place_id) {
            return;
        }
        directionsService.route({
            origin: {
                'placeId': origin_place_id
            },
            destination: {
                'placeId': destination_place_id
            },
            waypoints: mellomstoppFraDatabase,
            travelMode: travel_mode,
            optimizeWaypoints: true,
        }, function(response, status) {
            if (status === 'OK') {
                directionsDisplay.setDirections(response);
            } else {
                window.alert('Directions request failed due to ' + status);
            }
        });
    }
}
