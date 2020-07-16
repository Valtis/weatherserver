
function drawGraphs() {
    drawTemperatureGraph();
    drawHumidityGraph();
}

async function fetch_data(url, start, end) {

    let queryparam = "?start=" + start + "&end=" + end + "&offset=" + (new Date()).getTimezoneOffset();
    let response = await fetch(url + queryparam);
    let json = await response.json();
    return json;
}

async function drawTemperatureGraph() {
    let values = await drawGraph("temperature", "Lämpötila", "C");
    updateLastMeasurementTime(values);

    let midnight = new Date();
    midnight.setHours(0, 0, 0, 0);

    updateMinMaxMeasurement(values, "temperature", "C", midnight);
    updateMinMaxMeasurement(values, "temperature-all-time", "C");
}


async function drawHumidityGraph() {
    let values = await drawGraph("humidity", "Ilmankosteus", "%");

    let midnight = new Date();
    midnight.setHours(0, 0, 0, 0);

    updateMinMaxMeasurement(values, "humidity", "%", midnight);
    updateMinMaxMeasurement(values, "humidity-all-time", "%");
}


async function drawGraph(graphType, title, lastMeasurementUnit) {
    let datePickerStart = graphType + "-start";
    let datePickerEnd = graphType + "-end";
    start = document.getElementById(datePickerStart).value;
    end = document.getElementById(datePickerEnd).value;

    if (start === "") {
        let date = new Date();
        date.setDate(date.getDate() - 2); // by default show last 2 day(ish) of data.

        month = date.getMonth() + 1; // 0-11 ---> 1-12
        day = date.getDate();

        start = "" + date.getFullYear() + "-" + (month < 10 ? "0" : "") + month + "-" + (day < 10 ? "0" : "") + day;
        document.getElementById(datePickerStart).value = start;
    }

    if (end === "") {
        let date = new Date();

        month = date.getMonth() + 1;
        day = date.getDate() + 1;

        end = date.getFullYear() + "-" + (month < 10 ? "0" : "") + month + "-" + (day < 10 ? "0" : "") + day;
        document.getElementById(datePickerEnd).value = end;
    }

    let graphData = await fetch_data(graphType, start, end);
    let time = graphData.map(item => new Date(item["logged_at"]));
    let measuredValues = graphData.map(item => item["measured_" + graphType]);

    document.getElementById("last-" + graphType).innerHTML = parseFloat(measuredValues[measuredValues.length-1]).toFixed(1) + lastMeasurementUnit;

    var dataMap = {
        x: time,
        y: measuredValues,
      type: 'scatter'
    };

    var data = [dataMap];

    layout = {
        title: title,
        fot: { size: 18 },
        xaxis: { fixedrange: true },
        yaxis: { fixedrange: true },
    };

    config = {
        responsive: true,
        editable: false,
        displayModeBar: false,
    };

    Plotly.newPlot(graphType, data, layout, config);

    return {
        values: measuredValues,
        times: time
    };
}

function updateLastMeasurementTime(values) {
    let latestTime = values.times[values.times.length - 1];
    let elem = document.getElementById("last-measurement-time").innerHTML = latestTime.toLocaleString();
}

function updateMinMaxMeasurement(values, type, unit, startDate) {
    let startIndex = 0;
    if (startDate != undefined) {
        while (startDate > values.times[++startIndex] && startIndex < values.times.length);

        if (startIndex >= values.times.length) {
            return;
        }
    }

    let maxIndex = startIndex;
    let minIndex = startIndex;

    for (let i = startIndex; i < values.times.length; ++i) {
        if (values.values[i] > values.values[maxIndex]) {
            maxIndex = i;
        }

        if (values.values[i] < values.values[minIndex]) {
            minIndex = i;
        }
    }


    document.getElementById("highest-"+type).innerHTML =
        parseFloat(values.values[maxIndex]).toFixed(1) + unit + ", mitattu " + values.times[maxIndex].toLocaleString();

    document.getElementById("lowest-"+type).innerHTML =
        parseFloat(values.values[minIndex]).toFixed(1) + unit + ", mitattu " + values.times[minIndex].toLocaleString();
}

