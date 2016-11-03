document.getElementById("addRoute").onclick = addRoute;
document.getElementById("output").onchange = hentInfo;

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
     //console.log(rute);
     output.innerHTML += "<option value='" +  rute + "'>" + start + " - " + stop + "</option>";
   }
 }
})

function hentInfo(){
  const info = document.getElementById("info");
  info.innerHTML = "";

  database.ref("kjoreturer").once('value').then(function(snapshot) {
    for(user in snapshot.val()){
      for(mappe in snapshot.child(user).val()){
        for(tur in snapshot.child(user).child(mappe).val()){
          if(output.value == tur){
            let infoObject = snapshot.child(user).child(mappe).child(tur).val();
            let driver = infoObject.driverName;
            let startPlace = infoObject.startPlace;
            let stopPlace = infoObject.stopPlace;
            let time = infoObject.DriverArriveStopTime;

            info.innerHTML = driver + "\nStart: " + startPlace + "\nStop: " + stopPlace + "\nNår: " + time;
          }
        }
      }
    }
  });
}



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
