var jsonObj = null;
var fileReady = false;
var form = document.getElementById("drone_form");
let fileLabelInnerHtml = null;

//const axios = require('axios'); //already in layout
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.timeout = 2500;

// ------------------- event handlesrs -------------------

//show modal
var modalElemet = document.getElementById('modal');
document.getElementById("newEntry").onclick = () => {
    modalElemet.style.display = "flex";
};
//hide modal
modalElemet.onclick = (event) => {
    if (event.target == modalElemet)
        modalElemet.style.display = "none";
};
function cleanForm() {
    fileReady = false;
    form.getElementsByClassName("FileLabel")[0].innerHTML = fileLabelInnerHtml;
    form.getElementsByClassName("Button")[0].value = "";
    form.getElementsByClassName("Button")[1].value = "";
    form.getElementsByClassName("File")[0].value = "";
}
document.getElementById("closeModal").onclick = (event) => {
    modalElemet.style.display = "none";
    cleanForm();
};

//file change
document.getElementById("drone_file").onchange = (event) => {
    fileReady = false;

    let reader = new FileReader();
    reader.onload = () => {
        //corectly format the file to a string
        fileString = reader.result;
        fileString = fileString.replace(/,\s*$/, "");
        fileString = '{"data":[ ' + fileString + '] }';


        try {
            jsonObj = JSON.parse(fileString);
        } catch (e) {
            alert("Hay un problema con el archivo");
            return;
        }

        fileReady = true;
        console.log("file ready");
        document.getElementById("fileLabel").innerText = event.target.files[0].name;

    };
    reader.readAsText(event.target.files[0]);
};

// flight uploading
document.getElementById("drone_form").onsubmit = (event) => {
    event.preventDefault()
    if (fileReady == false) {
        alert("seleccione el archivo del que desea subir");
        return;
    }

    let dateIn = document.getElementById("drone_date").value;
    let timeIn = document.getElementById("drone_time").value;
    jsonObj.date = new Date(dateIn + " " + timeIn);

    axios.post('/api/drone', jsonObj)
        .then((response) => {
            addCard(response.data);
            modalElemet.style.display = "none";
            cleanForm();
        })
        .catch((error) => {
            console.log(error.message);
            alert(error.message);
        });
};

// eye-icons on-click
function detailsHandler(event) {
    droneId = event.target.parentNode.parentNode.id;
    window.location.href += "vuelos/" + droneId;
};
Array.from(document.getElementsByClassName("Eye")).forEach((icon) => icon.onclick = detailsHandler);

// trash-icons on-click
function deleteHandler(event) {
    card = event.target.parentNode.parentNode;
    axios.delete(`/api/vuelos/${card.id}`)
        .then((response) => {
            alert("borrado con exito");
            card.remove();
        })
        .catch((error) => {
            console.log(error);
            alert("Error al borrar:\n" + error.message);
        });
};
Array.from(document.getElementsByClassName("Delete")).forEach((icon) => {
    icon.onclick = deleteHandler;
});

// Logo on-clock
document.getElementsByClassName("Logo")[0].onclick = () => {
    window.location = '/'; //Go to homescreen
};


// ------------------- function declarations -------------------

// modifies doom - adds a card to the container
function addCard(json) {
    let { formatedDate, formatedTime, durationStr } = getStrings(json);
    let newCard = document.createElement("div");
    newCard.id = `${json._id}`;
    newCard.className = "Card";
    newCard.innerHTML = `<div class="Options"><i class="Eye material-icons">visibility</i><i class="Delete material-icons">delete</i></div><h2>${formatedDate}</h2><h4>${formatedTime}</h4><div class="Details"><span>entradas:${json.entries}</span><span>duracion: ${durationStr}</span></div><table><tr><th> </th><th>min</th><th>max</th><th>prom</th></tr><tr><td>temperatura</td><td>${json.overview.temp.min.toFixed(2)}</td><td>${json.overview.temp.max.toFixed(2)}</td><td>${json.overview.temp.mean.toFixed(2)}</td></tr><tr><td>temperatura</td><td>${json.overview.ppm.min.toFixed(2)}</td><td>${json.overview.ppm.max.toFixed(2)}</td><td>${json.overview.ppm.mean.toFixed(2)}</td></tr></table>`;

    newCard.getElementsByClassName("Eye")[0].onclick = detailsHandler;
    newCard.getElementsByClassName("Delete")[0].onclick = detailsHandler;

    document.getElementById("cardContainer").prepend(newCard);
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


// ------------------- function calls -------------------

//https://stackoverflow.com/questions/42535217/show-multiple-responsive-chart-in-the-same-page-using-chart-js
//paint each card's graphs
window.onload = function () {
    fileLabelInnerHtml = form.getElementsByClassName("FileLabel")[0].innerHTML;

    Array.from(document.getElementsByClassName("Card")).forEach((card) => {
        //request to API all entryes corresponding to the card

        //paint graph
    });
};

