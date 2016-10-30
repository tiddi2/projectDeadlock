var provider = new firebase.auth.GoogleAuthProvider();

// Initialize Firebase
var config = {
    apiKey: "AIzaSyDZZkOVCkcqXUjfP7cjW4bvudhXiEvY6kg",
    authDomain: "my-awesome-project-2c3ea.firebaseapp.com",
    databaseURL: "https://my-awesome-project-2c3ea.firebaseio.com",
    storageBucket: "my-awesome-project-2c3ea.appspot.com",
    messagingSenderId: "845900233799"
};
firebase.initializeApp(config);

//konstanter for html elementene
const btnLogin = document.getElementById("btnLogin");
//const btnSignout = document.getElementById("btnSignout");


btnLogin.addEventListener("click", e => {
    firebase.auth().signInWithRedirect(provider);
    firebase.auth().getRedirectResult().then(function(result) {
        if (result.credential) {
            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = result.credential.accessToken;
            // ...
        }
        // The signed-in user info.
        var user = result.user;
    }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
    });
});

firebase.auth().onAuthStateChanged(firebaseUser => {
    if (firebaseUser) {
        var userId = firebase.auth().currentUser.uid;
        firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
            if(snapshot.val()) {
                window.location.href = "/map/index.html"
            }
            else {
                window.location.href = "/map/setupProfile.html"
            }
        });
    }
    else {
        console.log("not logged in")
    }
});
