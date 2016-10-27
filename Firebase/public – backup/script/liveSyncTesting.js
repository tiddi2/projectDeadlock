const tekst1 = document.getElementById("tekst1");

const dbRefObject1 = firebase.database().ref().child('Chat')

tekst1.onkeyup =oppdater1;


dbRefObject1.on('value', snap => tekst2.innerHTML = snap.val());

var tekst;
dbRefObject1.on('value', snap => tekst = snap.val());
dbRefObject1.on('value', snap => tekst2.scrollTop = tekst2.scrollHeight);


function oppdater1(evt) {

    var date = new Date();
    var time = date.getHours()
    var minutt = date.getMinutes()
    var seconds = date.getSeconds()
    if(time < 10) {
        time = "0" + time
    }
    if(minutt < 10) {
        minutt = "0" + minutt
    }
    var key = evt.keyCode
    var userId = firebase.auth().currentUser.uid;
    if(key == 13 && tekst1.innerHTML.length <= 500) {
        //console.log("feilmelding1")
        if(tekst !== null) {
            firebase.database().ref().update({
                Chat:tekst + time + ":" + minutt + ":" + seconds + "  "+ firebase.auth().currentUser.displayName + ": " + tekst1.innerHTML
            });
        }
        else {
            firebase.database().ref().update({
                Chat:time + ":" + minutt + ":" + seconds + "  "+ firebase.auth().currentUser.displayName + ": " + tekst1.innerHTML
            });
        }
        tekst1.innerHTML = "";
        tekst2.scrollTop = tekst2.scrollHeight
    }
}




firebase.auth().onAuthStateChanged(firebaseUser => {
    if (firebaseUser) {
        //console.log(firebaseUser)
    }
     else {
        location.href = "https://projectdeadlock.com/";
    }
});
