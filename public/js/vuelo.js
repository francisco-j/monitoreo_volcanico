//const axios = require('axios'); //already in index
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.timeout = 2500;

// ------------------- event handlesrs -------------------

// Logo on-clock
document.getElementsByClassName("Logo")[0].onclick = () => {
    console.log("en homescreen");
    window.location = '/';
};


// ------------------- function declarations -------------------

//refractor data into DataTransferItemList.data
function refractor(fullArray) {

    function formatTime(timeString) {
        tempDate = new Date(timeString);
        let seconds = tempDate.getSeconds()
        if (seconds < 10) seconds = '0' + seconds;
        return tempDate.getMinutes() + ":" + seconds;
    }

    let myDatasets = {
        labels: [],
        temp: []
        //ppt: []
    };

    fullArray.forEach((element) => {
        myDatasets.labels.push(formatTime(element.milisegundos));
        myDatasets.temp.push(element.temperatura);
        //ppt
    });

    return myDatasets;
}

function drawChart(datasetLabel, data, labels) {
    var myLineChart = new Chart(
        document.getElementById("tempGraph"),
        {
            type: 'line',
            data: {
                datasets: [
                    {
                        lineTension: 0.1,
                        label: datasetLabel,
                        fill: true,
                        data: data
                    }
                ],
                labels: labels
            },
            options: {
                scales: {
                    xAxes: [{
                        display: true
                    }]
                }
            }
        }
    );
}

// ------------------- function calls -------------------

//ask api for data array
let droneId = document.getElementsByClassName("Card")[0].id;
axios.get(`/api/vuelos/data/${droneId}`)
    .then((response) => {
        let factorized = refractor(response.data); //separate the data from the drone into arrays

        drawChart("temperatura", factorized.temp, factorized.labels);
    })
    .catch((error) => {
        alert(error.message);
        console.log(error);
    });