//const axios = require('axios'); //already in index
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.timeout = 2500;

// ------------------- event handlesrs -------------------
var responseData;
// Logo on-clock
document.getElementsByClassName("Logo")[0].onclick = () => {
    window.location = '/';
};


// ------------------- function declarations -------------------

//refractor data into DataTransferItemList.data
function refractor(fullArray) {

    // --------- function declaration ---------
    function formatTime(timeString) {
        tempDate = new Date(timeString);
        let seconds = tempDate.getSeconds()
        if (seconds < 10) seconds = '0' + seconds;
        return tempDate.getMinutes() + ":" + seconds;
    }

    let myDatasets = {
        labels: [],
        temp: [],
        ppm: []
    };

    fullArray.forEach((element) => {
        myDatasets.labels.push(formatTime(element.milisegundos));
        myDatasets.temp.push(element.temperatura);
        myDatasets.ppm.push(element.ppm);
    });

    return myDatasets;
}

function drawChart(canvas, datasetLabel, data, labels) {
    window[datasetLabel] = new Chart(
        document.getElementById(canvas),
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


function drawChart(canvas, datasetLabel, data, labels) {
    window[datasetLabel] = new Chart(
        document.getElementById(canvas),
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


//ask api for data array
window.onload = function () {
    let droneId = document.getElementsByClassName("Card")[0].id;
    axios.get(`/api/vuelos/data/${droneId}`)
        .then((response) => {
            responseData = response.data;
            let factorized = refractor(response.data); //separate the data from the drone into arrays

            drawChart("tempGraph", "temperatura", factorized.temp, factorized.labels);
            drawChart("ppmGraph", "particulas por millon", factorized.ppm, factorized.labels);
        })
        .catch((error) => {
            alert(error.message);
            console.log(error);
        });
}
