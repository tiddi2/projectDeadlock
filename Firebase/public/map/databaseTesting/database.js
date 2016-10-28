document.getElementById("addRoute").onclick = addRoute;
const ruter = firebase.database().ref("kjoreturer");


function addRoute(){
  const start = document.getElementById("start").value;
  const slutt = document.getElementById("slutt").value;
  const navn = document.getElementById("navn").value;
  const omvei = parseInt(document.getElementById("omvei").value);
  const tid = document.getElementById("tid").value;
  const output = document.getElementById("output")

addToDatabase(navn,start,slutt,omvei,tid);
}

function addToDatabase(navn,start,slutt,omvei,tid){
  let newPostRef = ruter.push();
  newPostRef.set({
    driverArriveStopTime: tid,
    acceptedDetour: omvei,
    driverID: navn,
    driverName: navn,
    startPlace: start,
    stopPlace: slutt
  });
}
