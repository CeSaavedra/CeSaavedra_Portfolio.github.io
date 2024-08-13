let counter = 2;

document.getElementById('input-append-btn').addEventListener('click', function() {
    counter++;
    // Create a new div container for input-row
    var newInputRow = document.createElement('div');
    newInputRow.className = 'input-row';

    // Create the inner HTML for the new input-row
    newInputRow.innerHTML = `
        <div class="input-row-number">
            <p>${counter}</p>
        </div>
        <div class="input-row-x">
            <input type="text">
        </div>
        <div class="input-row-y">
            <input type="text">
        </div>
    `;

    // Append the new input-row to the container
    var inputAppend = document.querySelector('.input-append');
    inputAppend.parentNode.insertBefore(newInputRow, inputAppend);
});

document.addEventListener('DOMContentLoaded', function() {
    // Fixed values for the scatter plot
    let xValues = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];
    let yValues = [10, 25, 13, 40, 22, 35, 50, 28, 60, 45, 33, 70, 40, 55, 45, 80, 50, 65, 55, 90, 60, 75, 65, 100, 70, 85, 75, 110, 80, 95];

    // Create scatter plot data
    var scatterData = {
        x: xValues,
        y: yValues,
        mode: 'markers',
        type: 'scatter',
        name: 'Input Data'
    };

    // Calculate linear regression
    var xSum = xValues.reduce((a, b) => a + b, 0);
    var ySum = yValues.reduce((a, b) => a + b, 0);
    var xySum = xValues.map((x, i) => x * yValues[i]).reduce((a, b) => a + b, 0);
    var xSquaredSum = xValues.map(x => x * x).reduce((a, b) => a + b, 0);
    var n = xValues.length;

    var slope = (n * xySum - xSum * ySum) / (n * xSquaredSum - xSum * xSum);
    var intercept = (ySum - slope * xSum) / n;

    var regressionLine = {
        x: xValues,
        y: xValues.map(x => slope * x + intercept),
        mode: 'lines',
        type: 'scatter',
        name: 'Regression Line'
    };

    var data = [scatterData, regressionLine];

    var layout = {
        title: 'Linear Regression Model',
        xaxis: {
            title: 'X Axis'
        },
        yaxis: {
            title: 'Y Axis'
        }
    };

    Plotly.newPlot('graph-container', data, layout);
});

document.getElementById('input-form').addEventListener('submit', function(event) {
    event.preventDefault();
    updateGraph();
});

function updateGraph() {
    let matrix = [];

    document.querySelectorAll('.input-row').forEach(row => {
        let x = row.querySelector('.input-row-x input').value;
        let y = row.querySelector('.input-row-y input').value;
        if (x && y) {
            matrix.push([parseFloat(x), parseFloat(y)]);
        }
    });

    console.log(matrix);  // This will log the matrix to the console

    // Initialize xValues and yValues arrays
    let xValues = [];
    let yValues = [];

    // Extract x and y values from the matrix
    for (let i = 0; i < matrix.length; i++) {
        xValues.push(matrix[i][0]);
        yValues.push(matrix[i][1]);
    }

    console.log('xValues:', xValues);  // This will log the xValues array to the console
    console.log('yValues:', yValues);  // This will log the yValues array to the console

    // Create scatter plot data
    var scatterData = {
        x: xValues,
        y: yValues,
        mode: 'markers',
        type: 'scatter',
        name: 'Input Data'
    };

    // Calculate linear regression
    var xSum = xValues.reduce((a, b) => a + b, 0);
    var ySum = yValues.reduce((a, b) => a + b, 0);
    var xySum = xValues.map((x, i) => x * yValues[i]).reduce((a, b) => a + b, 0);
    var xSquaredSum = xValues.map(x => x * x).reduce((a, b) => a + b, 0);
    var n = xValues.length;

    var slope = (n * xySum - xSum * ySum) / (n * xSquaredSum - xSum * xSum);
    var intercept = (ySum - slope * xSum) / n;

    var regressionLine = {
        x: xValues,
        y: xValues.map(x => slope * x + intercept),
        mode: 'lines',
        type: 'scatter',
        name: 'Regression Line'
    };

    var data = [scatterData, regressionLine];

    var layout = {
        title: 'Linear Regression Model',
        xaxis: {
            title: 'X Axis'
        },
        yaxis: {
            title: 'Y Axis'
        }
    };

    Plotly.newPlot('graph-container', data, layout);
}