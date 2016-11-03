document.getElementById("output").onchange = hentInfo;

const database = firebase.database();
const ruter = database.ref("kjoreturer");
const output = document.getElementById("output");


function hentfraDatabase() {
    ruter.on("child_added", function(snapshot) {
        for (user in snapshot.val()) {
            for (rute in snapshot.child(user).val()) {
                console.log(snapshot)
                let driverName = snapshot.child(user).child(rute).val().driverName;
                let tidspunkt = snapshot.child(user).child(rute).val().DriverArriveStopTime;
                let start = snapshot.child(user).child(rute).val().startPlace;
                let stop = snapshot.child(user).child(rute).val().stopPlace;
                let omveiTid = snapshot.child(user).child(rute).val().acceptedDetour;

                var divElement = document.createElement("div")
                divElement.innerHTML = "Fra: <span>" + start + "</span>" + "</br>" + "Til: <span>" + stop + "</span>" +
                "</br> Med: " + driverName;
                divElement.className = "drivesPresented"
                document.getElementById("placement").appendChild(divElement)
            }
        }
    })
}
