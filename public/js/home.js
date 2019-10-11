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
modalElemet.onclick = (event) => {
    if (event.target == modalElemet)
    modalElemet.style.display = "none";
};
document.getElementById("closeModal").onclick = (event) => {
    modalElemet.style.display = "none";
};

//file change
document.getElementById("drone_file").onchange = (event) => {
    fileReady = false;

    let reader = new FileReader();
    reader.onload = () => {
        //corectly format the file to a string
        fileString = reader.result;
        //TODO:
        //fileString = fileString.replace('\n', ',');
        fileString = fileString.replace(/,\s*$/, "");
        fileString = '{"data":[ ' + fileString + '] }';

        fileReady = true;
        console.log("file ready");
        document.getElementById("fileLabel").innerText = event.target.files[0].name;
    };
    reader.readAsText(event.target.files[0]);
};

// the important one. for flight uploading
document.getElementById("drone_form").onsubmit = (event) => {
    event.preventDefault()
    if (fileReady == false) {
        alert("upload a file, or wait for the file to upload");
        return;
    }

    let jsonObj = JSON.parse(fileString);

    let dateIn = document.getElementById("drone_date").value;
    let timeIn = document.getElementById("drone_time").value;
    jsonObj.date = new Date(dateIn + " " + timeIn);

    axios.post('/api/drone', jsonObj)
        .then((response) => {
            addCard(response.data);
            modalElemet.style.display = "none";
        })
        .catch((error) => {
            console.log(error.message);
            resizeBy.send(error.message);
        });
};

//modifies doom
function addCard(json) {
    let { formatedDate, formatedTime, durationStr } = getStrings(json);
    let newCard = `<div class="Card" id="card${json.id}"><h2>${formatedDate}</h2><h4>${formatedTime}</h4><div class="Details"><span>entradas:${json.entries}</span><span>duracion: ${durationStr}</span></div><table><tr><th> </th><th>min</th><th>max</th><th>prom</th></tr><tr><td>temperatura</td><td>${json.overview.temp.min}</td><td>${json.overview.temp.max}</td><td>${json.overview.temp.mean.toFixed(2)}</td></tr></table></div>`;

    let container = document.getElementById("cardContainer");
    container.innerHTML = newCard + container.innerHTML;
};
function getStrings(json) {
    var monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    let tempDate = new Date(json.date)
    let formatedDate = tempDate.getDate() + ' ' + monthNames[tempDate.getMonth()] + ' ' + tempDate.getFullYear();

    let hours = (tempDate.getHours()) % 12; // mod 12;
    if (hours == 0) hours = 12; //if'0' then'12'
    let ampm = tempDate.getHours() >= 12 ? 'pm' : 'am';
    let minutes = tempDate.getMinutes();
    if (minutes < 10) minutes = '0' + minutes;
    let formatedTime = hours + ':' + minutes + ' ' + ampm;

    tempDate = new Date(json.duration);
    let seconds = tempDate.getSeconds()
    if (seconds < 10) seconds = '0' + seconds;
    durationStr = tempDate.getMinutes() + ":" + seconds;

    return { formatedDate, formatedTime, durationStr };
};

// make the eye icons show the full description
Array.from(document.getElementsByClassName("Eye")).forEach((icon) => {
    icon.onclick = (event) => {
        droneId = event.target.parentNode.parentNode.id;
        window.location.href += "vuelos/" + droneId;
    };
});

// make the trash icons delete the entrie
Array.from(document.getElementsByClassName("Delete")).forEach((icon) => {
    icon.onclick = (event) => {
        card = event.target.parentNode.parentNode;
        axios.delete(`/api/vuelos/${card.id}`)
            .then((response) => {
                alert("borrado con exito");
                card.remove();
            })
            .catch((error) => {
                console.log(error);
                alert("Error al borrar:\n"+error.message);
            });
    };
});

/*
function fileToJson(fileString) {
    return '{"date":null, "data":[ ' + fileString + '] }';
};
*/

//TODO: reset file tag after push

