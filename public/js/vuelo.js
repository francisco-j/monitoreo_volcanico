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
        myDatasets.labels.push(formatTime(element.mili));
        myDatasets.temp.push(element.temp);
        myDatasets.ppm.push(element.ppm);
    });

    return myDatasets;
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

function drawChart(canvas, datasetLabel, data, labels, ymin, ymax) {
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
                    }],
                    yAxes: [{
                        ticks: {
                            suggestedMin: ymin,
                            suggestedMax: ymax
                        }
                    }],
                }
            }
        }
    );
}

//ask api for data array
window.onload = function () {
    let droneId = document.getElementsByClassName("Card")[0].id;
    axios
        .get(`/api/vuelos/data/${droneId}`)
        .then((response) => {
            responseData = response.data;
            let factorized = refractor(response.data); //separate the data from the drone into arrays

            drawChart("tempGraph", "temperatura C°", factorized.temp, factorized.labels);
            drawChart("ppmGraph", "particulas por millon", factorized.ppm, factorized.labels, 0, 5000);
        })
        .catch((error) => {
            alert(error.message);
            console.log(error);
        });
}
S