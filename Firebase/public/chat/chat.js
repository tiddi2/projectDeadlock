const provider = new firebase.auth.GoogleAuthProvider();
const writingField = document.getElementById("writingField");
const chatLog = document.getElementById("Chat")
const meldinger = firebase.database().ref("chat")
writingField.onkeyup = send;

var lastMessageDate,nextTolastMessage;
var monthName = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Des"]
//hent ut fra database
meldinger.on('child_added', function (snap) {
    var melding = snap.child("msg").val()
    var displayName = snap.child("name").val()
    var showTime = snap.child("showTime").val()
    var lastMessageDate = snap.child("datestamp").val()
    if(nextTolastMessage == undefined || (nextTolastMessage !== lastMessageDate)) {
        Chat.innerHTML += lastMessageDate + "</br>";
    }
    Chat.innerHTML += showTime + "  "+ displayName + ": " + melding;
    chatLog.scrollTop = chatLog.scrollHeight;
    nextTolastMessage = snap.child("datestamp").val()
});
//skriv inn til database
function writeUserData(displayName,message) {
    var today = new Date()
    var year = today.getFullYear().toString()
    var month = monthName[(today.getMonth()+1)]
    var date = today.getDate().toString()
    var datoString = date + " " + month + " " + year;
    var hour = today.getHours()
    var minute = today.getMinutes()
    if(hour < 10) {
        hour = "0" + hour
    }
    if(minute < 10) {
        minute = "0" + minute
    }
    if(displayName == null) {
        displayName = "Anonym"
    }
    var newPostRef = meldinger.push();
    newPostRef.set({
        msg: message,
        datestamp: datoString,
        showTime: hour.toString() + ":" + minute.toString(),
        name: displayName
    });
}
//Send melding
function send(evt) {
    var key = evt.keyCode
    var displayName = firebase.auth().currentUser.displayName;
    if(key == 13 && writingField.value.length <= 500) {
        if (/\S/.test(writingField.value)) {
            writeUserData(displayName,writingField.value + "<br>")
            writingField.value = "";
        }
        else {
            writingField.value = "";
        }
    }
}
