var fileString = null;
var fileReady = false;
var modalElemet = document.getElementById('modal');

//const axios = require('axios'); //already in index
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.timeout = 2500;


//show modal
document.getElementById("newEntry").onclick = () => {
    modalElemet.style.display = "flex";
};
//hide modal
modalElemet.onclick = (event)=>{
    if (event.target == modalElemet)
        modalElemet.style.display = "none";
};

//file change
document.getElementById("drone_file").onchange = (event) => {
    fileReady = false;

    let reader = new FileReader();
    reader.onload = () => {
        //corectly format the file to a string
        fileString = reader.result;
        //fileString = fileString.replace('\n', ',');
        fileString = '{"data":[ ' + fileString + '] }';
        
        fileReady = true;
        console.log("file ready");
        document.getElementById("fileLabel").innerText = event.target.files[0].name;
    };
    reader.readAsText(event.target.files[0]);
};

// the important one. for data sending
document.getElementById("drone_form").onsubmit = (event) => {
    event.preventDefault()
    if (fileReady == false){
        alert("upload a file, or wait for the file to upload");
        return;
    }

    let jsonObj = JSON.parse(fileString);

    let dateIn = document.getElementById("drone_date").value;
    let timeIn = document.getElementById("drone_time").value;
    jsonObj.date = new Date(dateIn + " " + timeIn);

    axios.post('/api/drone', jsonObj)
        .then( (response)=>{
            addCard(response.data);
            modalElemet.style.display = "none";
        })
        .catch((error)=>{
            console.log(error.message);
        });
};
function addCard(json) {
    var monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

    let tempDate = new Date(json.date)
    let dateStr = tempDate.getDate() + ' ' + monthNames[tempDate.getMonth()] + ' ' + tempDate.getFullYear();
        tempDate = new Date(json.duration);
    let durationStr = `duracion: ${tempDate.getMinutes()}:${tempDate.getSeconds()}`;
    let overviewTable = `<table><tr><th> </th><th>min</th><th>max</th><th>prom</th></tr><tr><td>temperatura</td><td>${json.overview.temp.min}</td><td>${json.overview.temp.max}</td><td>${json.overview.temp.mean.toFixed(2)}</td></tr></table>`;
    let newCard = `<div class="Card" id="card${json.id}"><h2>${dateStr}</h2><div class="Details"><span>Entradas:${json.entries}</span><span>Entradas:${durationStr}</span></div>${overviewTable}</div>`;    

    let container = document.getElementById("cardContainer");
    container.innerHTML = newCard + container.innerHTML;
};

/*
function fileToJson(fileString) {
    return '{"date":null, "data":[ ' + fileString + '] }';
};
*/

//TODO: reset file tag after push
 
