document.getElementById("addRoute").onclick = addRoute;

function addRoute(){
  let start = document.getElementById("start").value;
  let mellomstopp = document.getElementById("mellomstopp").value;
  let slutt = document.getElementById("slutt").value;
  let navn = document.getElementById("navn").value;
  const output = document.getElementById("output")

  output.innerHTML = start + mellomstopp + slutt + navn;
}
