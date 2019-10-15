//const axios = require('axios'); //already in index
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.timeout = 2500;


//ask api for data array
var droneId = document.getElementsByClassName("Card")[0].id;
var fullArray = null;
var myDatasets = myDatasets = {
    labels: [],
    temp: []
    //ppt: []
};

//refractor data into DataTransferItemList.data
function refractor(fullArray) {

    function formatTime(timeString) {
        tempDate = new Date(timeString);
        let seconds = tempDate.getSeconds()
        if (seconds < 10) seconds = '0' + seconds;
        return tempDate.getMinutes() + ":" + seconds;
    }

    fullArray.forEach((element) => {
        myDatasets.temp.push(element["temperatura"]);
        myDatasets.labels.push(formatTime(element.milisegundos));
        //TODO: ppt
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


axios.get(`/api/vuelos/data/${droneId}`)
    .then((response) => {
        fullArray = response.data; //the data array from the drone
        let factorized = refractor(fullArray);
        drawChart("temperatura", factorized.temp, factorized.labels);
    })
    .catch((error) => {
        //TODO: handle properly
        console.log(error);
    });