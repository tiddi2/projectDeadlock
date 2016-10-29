document.getElementById("addRoute").onclick = addRoute;
const database = firebase.database();
const ruter = database.ref("kjoreturer");
const output = document.getElementById("output");


function addRoute(){
  const start = document.getElementById("start").value;
  const slutt = document.getElementById("slutt").value;
  const navn = document.getElementById("navn").value;
  const omvei = parseInt(document.getElementById("omvei").value);
  const tid = document.getElementById("tid").value;

addToDatabase(navn,navn,start,slutt,omvei,tid);
}

ruter.on("child_added", function(snapshot){
 for (user in snapshot.val()){
   for(rute in snapshot.child(user).val()){
     let start = snapshot.child(user).child(rute).val().startPlace;
     let stop = snapshot.child(user).child(rute).val().stopPlace;
     let id = rute;
     output.innerHTML += "<option id='" +  id + "'>" + start + " - " + stop + "</option>";
   }
 }
})

function addToDatabase(id,navn,start,slutt,omvei,tid){
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
