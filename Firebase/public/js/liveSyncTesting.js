var provider = new firebase.auth.GoogleAuthProvider();
const btnSignout = document.getElementById("btnSignout");
btnSignout.addEventListener('click', e => {
    firebase.auth().signOut().then(function() {
        // Sign-out successful.
    }, function(error) {
        // An error happened.
    });
})

const writingField = document.getElementById("writingField");

const dbRefObject1 = firebase.database().ref().child('Chat')

writingField.onkeyup =oppdater1;


dbRefObject1.on('value', snap => Chat.innerHTML = snap.val());

var tekst;
dbRefObject1.on('value', snap => tekst = snap.val());
dbRefObject1.on('value', snap => Chat.scrollTop = Chat.scrollHeight);


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
    if(key == 13 && writingField.innerHTML.length <= 500) {
        //console.log("feilmelding1")
        if(tekst !== null) {
            firebase.database().ref().update({
                Chat:tekst + time + ":" + minutt + ":" + seconds + "  "+ firebase.auth().currentUser.displayName + ": " + writingField.innerHTML
            });
        }
        else {
            firebase.database().ref().update({
                Chat:time + ":" + minutt + ":" + seconds + "  "+ firebase.auth().currentUser.displayName + ": " + writingField.innerHTML
            });
        }
        writingField.innerHTML = "";
        Chat.scrollTop = Chat.scrollHeight
    }
}



/*
firebase.auth().onAuthStateChanged(firebaseUser => {
    if (firebaseUser) {
        //console.log(firebaseUser)
        console.log(window.location.href)
    }
     else {
        var completeURLAdress = window.location.href
        var urlAdress = completeURLAdress.substring(27);

         window.location.href  = "/login.html";
        //location.href = "https://projectdeadlock.com/login.php?";
    }
});
*/
