document.getElementById("sendMelding").onclick = sendMelding;
var tilbakemelding = document.getElementById("tilbakemelding")
var navn = document.getElementById("nameField")
var epost = document.getElementById("emailField")
var melding =  document.getElementById("message")
function sendMelding() {
    if(navn.value == "") {
        tilbakemeldingFunksjon(tilbakemelding,"Ikke gyldig navn",false)
    }
    else if(melding.value == "") {
        tilbakemeldingFunksjon(tilbakemelding,"Ikke gyldig melding",false)
    }
    else if(validateEmail(epost.value)) {
        writeUserData(navn.value,epost.value,melding.value)
    }
    else {
        tilbakemeldingFunksjon(tilbakemelding,"Ikke gyldig epostadresse",false)
    }
}

function writeUserData(navn,epost,melding) {
    var today = new Date().toString()
    var newPostRef = firebase.database().ref("contactForm").push();
    newPostRef.set({
        name: navn,
        email:epost,
        message: melding,
        datestamp: today
    });
    document.getElementById("main-contact-form").reset();
    tilbakemeldingFunksjon(tilbakemelding,"Takk for din melding",true)
}


function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function tilbakemeldingFunksjon(tilbakemeldingFelt,melding,skalFjernes) {
    tilbakemeldingFelt.innerHTML = melding
    tilbakemeldingFelt.style.display  = "block";
    if(skalFjernes) {
        setTimeout(function(){
            tilbakemelding.style.display  = "none";
        }, 2500);
    }
}
