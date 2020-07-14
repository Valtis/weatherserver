
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
    await drawGraph("temperature", "Lämpötila")
}


async function drawHumidityGraph() {
    await drawGraph("humidity", "Ilmankosteus")
}


async function drawGraph(graphType, title) {
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

    document.getElementById("last-" + graphType).innerHTML = parseFloat(measuredValues[measuredValues.length-1]).toFixed(1);

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
}

