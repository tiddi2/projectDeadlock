// Initialize Firebase
var config = {
    apiKey: "AIzaSyDZZkOVCkcqXUjfP7cjW4bvudhXiEvY6kg",
    authDomain: "my-awesome-project-2c3ea.firebaseapp.com",
    databaseURL: "https://my-awesome-project-2c3ea.firebaseio.com",
    storageBucket: "my-awesome-project-2c3ea.appspot.com",
    messagingSenderId: "845900233799"
};
firebase.initializeApp(config);

firebase.auth().onAuthStateChanged(firebaseUser => {
    if (firebaseUser) {
        //console.log("innlogget")
        var userUID = (firebase.auth().currentUser.uid).toString()
        var nettadresse = (window.location.href).toString()
        logURL(userUID, nettadresse)
    } else {
        firebase.auth().signInAnonymously();
        console.log("laget anonym acount")
    }
});

function logURL(userID, adresse) {
    firebase.database().ref('userInfo/' + userID).set({
        lastURL: adresse
    });
}
