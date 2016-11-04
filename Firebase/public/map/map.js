var userid, displayName, email, photoURL
var mellomstoppFraDatabase;
const waypoints = firebase.database().ref("waypoints")
var myStops = []
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
        window.location.href = "../login.html"
    }
});
var directionsService;
var directionsDisplay;
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
    var bounds = new google.maps.LatLngBounds;
    var service = new google.maps.DistanceMatrixService;
    var geocoder = new google.maps.Geocoder;
    directionsService = new google.maps.DirectionsService;
    directionsDisplay = new google.maps.DirectionsRenderer;
    /*var directionsDisplay = new google.maps.DirectionsRenderer({
      draggable: true,
      map: map
    });
    */
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
                        } else if (results[1]) {
                            infoWindow.setContent(results[1].formatted_address);
                            startPosition.value = results[1].formatted_address;
                        } else {
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
    var driverLabel = document.getElementById("driverLabel")
    var passengerLabel = document.getElementById("passengerLabel")
    var switcher = document.getElementById("switcher")
    var switchElement = document.getElementById("driverPassengerSwitch")
    var switchLabel = document.getElementById("switchLabel")
    var destination_input = document.getElementById('destination-input');
    var avalible = document.getElementById("placement")
    confirm_route.onclick = collectData
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(origin_input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(destination_input);

    map.controls[google.maps.ControlPosition.TOP_LEFT].push(driverLabel);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(switcher);
    //switcher.appendChild(switchElement)
    //switcher.appendChild(switchLabel)
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(passengerLabel);

    map.controls[google.maps.ControlPosition.TOP_LEFT].push(confirm_route);

    map.controls[google.maps.ControlPosition.RIGHT_CENTER].push(avalible)
    var origin_autocomplete = new google.maps.places.Autocomplete(origin_input);
    origin_autocomplete.bindTo('bounds', map);
    var destination_autocomplete = new google.maps.places.Autocomplete(destination_input);
    destination_autocomplete.bindTo('bounds', map);

    function collectData() {
        //if passasjer
        if(document.getElementById("myonoffswitch").checked) {
            myStops[0] = {
                location: origin_input.value,
                stopover: true
            }
            myStops[1] = {
                location:  destination_input.value,
                stopover: true
            }
            hentfraDatabase()
        }
        //if sjåfør
        else {
            //Legger inn kjøre rute i database på den gamle måten (som sjåfør)
            const driverId = userid
            const arrivalTime = (new Date()).toString() //skal bli utfyllt automatisk,
            const acceptedDetour = 30
            const driverName = displayName
            const startPlace = origin_input.value
            const stopPlace = destination_input.value
            if (startPlace !== "" && stopPlace !== "") {

                addRouteToDatabase(driverId,driverName,startPlace,stopPlace,acceptedDetour,arrivalTime)
                origin_input.value = "";
                destination_input.value = "";
            }
        }

        function hentfraDatabase() {
            const database = firebase.database();
            const ruter = database.ref("kjoreturer");
            ruter.on("child_added", function(snapshot) {
                for (user in snapshot.val()) {
                    for (trip in snapshot.child(user).val()) {
                        let driverName = snapshot.child(user).child(trip).val().driverName;
                        let tidspunkt = snapshot.child(user).child(trip).val().DriverArriveStopTime;
                        let start = snapshot.child(user).child(trip).val().startPlace;
                        let stop = snapshot.child(user).child(trip).val().stopPlace;
                        let omveiTid = snapshot.child(user).child(trip).val().acceptedDetour;

                        var divElement = document.createElement("div")
                        divElement.innerHTML = "From: " + start + "</br>" + "To: " + stop +
                        "</br> With: " + driverName;
                        divElement.setAttribute('from', start);
                        divElement.setAttribute('to', stop);
                        divElement.setAttribute('with', driverName);
                        divElement.setAttribute('driverID', snapshot.key);
                        divElement.className = "drivesPresented"
                        divElement.onclick = getInfoAboutRoute
                        document.getElementById("placement").appendChild(divElement)
                    }
                }
            })
        }

        function getInfoAboutRoute() {
            var driveFrom = this.getAttribute("from")
            var driveTo = this.getAttribute("to")
            directionsService.route({
                origin: driveFrom,
                destination: driveTo,
                travelMode: 'DRIVING',
                waypoints: myStops,
                optimizeWaypoints: false
            }, function(response, status) {
                if (status === 'OK') {
                    directionsDisplay.setDirections(response);
                    service.getDistanceMatrix({
                        origins: [driveFrom, driveFrom, myStops[0].location,myStops[1].location],
                        destinations: [driveTo, myStops[0].location,myStops[1].location, driveTo],
                        travelMode: 'DRIVING',
                        unitSystem: google.maps.UnitSystem.METRIC,
                        avoidHighways: false,
                        avoidTolls: false
                    }, function(response, status) {
                        if (status !== 'OK') {
                            alert('Error was: ' + status);
                        }
                        else {
                            var originList = response.originAddresses;
                            var destinationList = response.destinationAddresses;
                            var originalTime = response.rows[0].elements[0].duration.value/60;
                            var originalDistanse = response.rows[0].elements[0].distance.value/1000;
                            document.getElementById("originalTime").innerHTML = "Orginal tid: " + originalTime.toFixed(2) + " min";
                            document.getElementById("originalDistance").innerHTML = "Orginal distanse: " + originalDistanse.toFixed(2) + " km";

                            document.getElementById("map").style.width = 85 + "%";
                            var totalTime = 0;
                            var totalDistance = 0;
                            for (var i = 1; i < originList.length; i++) {
                                var results = response.rows[i].elements;

                                totalTime += results[i].duration.value/60
                                totalDistance += results[i].distance.value/1000
                            }


                            document.getElementById("totalTime").innerHTML = "Total tid: " + totalTime.toFixed(2) + " min";
                            document.getElementById("extraTime").innerHTML =  "Ekstra tid: " + (totalTime - originalTime).toFixed(2) + " min";

                            document.getElementById("totalDistance").innerHTML = "Total distanse: " + totalDistance.toFixed(2) + " km";
                            document.getElementById("extraDistance").innerHTML =  "Ekstra distanse: " + (totalDistance - originalDistanse).toFixed(2) + " km";
                        }
                    });
                } else {
                    window.alert('Directions request failed due to ' + status);
                }
            });
            origin_input.value = "";
            destination_input.value = "";
        }
    }


    function expandViewportToFitPlace(map, place) {
        if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
        } else {
            map.setCenter(place.geometry.location);
            map.setZoom(17);
        }
    }
/*
    origin_autocomplete.addListener('place_changed', function() {
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
        console.log(destination_autocomplete)
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
*/
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
            optimizeWaypoints: false,
        }, function(response, status) {
            if (status === 'OK') {
                directionsDisplay.setDirections(response);
            } else {
                window.alert('Directions request failed due to ' + status);
            }
        });
    }
}
