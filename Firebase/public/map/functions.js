function addRouteToDatabase(id, navn, start, slutt, omvei, tid) {
    const database = firebase.database();

    let rute = database.ref("/kjoreturer/" + id + "/Drives");
    let newPostRef = rute.push();
    newPostRef.set({
        driverArriveStopTime: tid,
        acceptedDetour: omvei,
        driverName: navn,
        startPlace: start,
        stopPlace: slutt
    });
}

function getRouteInfo(id) {
    const database = firebase.database();


    database.ref("kjoreturer").once('value').then(function(snapshot) {
        for (user in snapshot.val()) {
            for (mappe in snapshot.child(user).val()) {
                for (tur in snapshot.child(user).child(mappe).val()) {
                    if (id == tur) {
                        return snapshot.child(user).child(mappe).child(tur).val();
                    }
                }
            }
        }
    });
}
