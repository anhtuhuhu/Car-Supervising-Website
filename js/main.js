const firebaseConfig = {
    apiKey: "AIzaSyDFyi9-Fi5aBljsgrLZvkjh4RJ7Ws_X4h4",
    authDomain: "car-supervising.firebaseapp.com",
    databaseURL: "https://car-supervising-default-rtdb.firebaseio.com",
    projectId: "car-supervising",
    storageBucket: "car-supervising.appspot.com",
    messagingSenderId: "696234292176",
    appId: "1:696234292176:web:e63be883a7f351d2397fd5",
};

let lat = 0;
let lng = 0;
var map, timeData;
var engine_load, engine_temp, engine_RPM, vin;
var car_spd, currentSpd, air_flow_rate, throttle_pos, fuel_level, torque_force;
var speedChart, speedDisplayChart, fuelChart, engineLoadChart, torqueForceChart;
var checkData;
var fault_codes = [];
var carImage = document.getElementById('car_image');

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

document.addEventListener("DOMContentLoaded", (event) => {
    initSpeedChart();
    initSpeedDisplayChart();
    initFuelChart();
    initEngineLoadChart();
    initTorqueForceChart();
});

function updateFirebaseData() {
    // Lấy ngày hiện tại
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0, nên cộng thêm 1
    var yyyy = today.getFullYear();
    //var currentDate = dd + "-" + mm + "-" + yyyy;
    var currentDate = "25-05-2024";

    function getPreviousDate() {
        var previousDate = new Date(today);
        previousDate.setDate(previousDate.getDate() - 1);
        var dd = String(previousDate.getDate()).padStart(2, "0");
        var mm = String(previousDate.getMonth() + 1).padStart(2, "0");
        var yyyy = previousDate.getFullYear();
        return dd + "-" + mm + "-" + yyyy;
    }
  
    // Auto load PID04
    firebase.database().ref("/" + currentDate + "/Mode1_PID04/engine_load").on("value", function(snapshot){
        if(snapshot.exists()){
            engine_load = snapshot.val().toFixed(2);
            updateEngineLoadChart(engine_load);
        }
        else{
            var previousDate = getPreviousDate();
            firebase.database().ref("/" + previousDate + "/Mode1_PID04/engine_load").on("value", function(snapshot){
                    engine_load = snapshot.val().toFixed(2);
                    updateEngineLoadChart(engine_load);
            });
        }
    });
  
    // Auto load PID05
    firebase.database().ref("/" + currentDate + "/Mode1_PID05/engine_temperature").on("value", function(snapshot){
        if(snapshot.exists()){
            engine_temp = snapshot.val();
            document.getElementById("engine_temp").innerHTML = engine_temp;
        }
        else{
            var previousDate = getPreviousDate();
            firebase.database().ref("/" + previousDate + "/Mode1_PID05/engine_temperature").on("value", function(snapshot){
                    engine_temp = snapshot.val();
                    document.getElementById("engine_temp").innerHTML = engine_temp;
            });
        }
    });
    
    // Auto load PID10
    firebase.database().ref("/" + currentDate + "/Mode1_PID10/air_flow_rate").on("value", function(snapshot){
        if(snapshot.exists()){
            air_flow_rate = snapshot.val();
            document.getElementById("air_flow_rate").innerHTML = air_flow_rate;
        }
        else{
            var previousDate = getPreviousDate();
            firebase.database().ref("/" + previousDate + "/Mode1_PID10/air_flow_rate").on("value", function(snapshot){
                    air_flow_rate = snapshot.val();
                    document.getElementById("air_flow_rate").innerHTML = air_flow_rate;
            });
        }
    });
  
    // Auto load PID11
    firebase.database().ref("/" + currentDate + "/Mode1_PID11/throttle_pos").on("value", function(snapshot){
        if(snapshot.exists()){
            throttle_pos = snapshot.val().toFixed(2);
            document.getElementById("throttle_pos").innerHTML = throttle_pos;
        }
        else{
            var previousDate = getPreviousDate();
            firebase.database().ref("/" + previousDate + "/Mode1_PID11/throttle_pos").on("value", function(snapshot){
                    throttle_pos = snapshot.val().toFixed(2);
                    document.getElementById("throttle_pos").innerHTML = throttle_pos;
            });
        }
    });

    // Auto load PID12
    firebase.database().ref("/" + currentDate + "/Mode1_PID12/engine_rpm").on("value", function(snapshot){
        if(snapshot.exists()){
            engine_RPM = snapshot.val();
            document.getElementById("engine_RPM").innerHTML = engine_RPM;
        }
        else{
            var previousDate = getPreviousDate();
            firebase.database().ref("/" + previousDate + "/Mode1_PID12/engine_rpm").on("value", function(snapshot){
                    engine_RPM = snapshot.val();
                    document.getElementById("engine_RPM").innerHTML = engine_RPM;
            });
        }
    });
  
    // Auto load PID13
    firebase.database().ref("/" + currentDate + "/Mode1_PID13/vehicle_speed").on("value", function(snapshot){
        if(snapshot.exists()){
            car_spd = snapshot.val().toFixed(2);
            document.getElementById("car_spd").innerHTML = car_spd;
            timeData = new Date().toLocaleTimeString();
            updateSpeedChart(timeData, car_spd);
            updateSpeedDisplayChart(car_spd);
        }
        else{
            var previousDate = getPreviousDate();
            firebase.database().ref("/" + previousDate + "/Mode1_PID13/vehicle_speed").on("value", function(snapshot){
                    car_spd = snapshot.val().toFixed(2);
                    document.getElementById("car_spd").innerHTML = car_spd;
                    timeData = new Date().toLocaleTimeString();
                    updateSpeedChart(timeData, car_spd);
                    updateSpeedDisplayChart(car_spd);
            });
        }
    });
  
    // Auto load PID47
    firebase.database().ref("/" + currentDate + "/Mode1_PID47/fuel_level").on("value", function(snapshot){
        if(snapshot.exists()){
            fuel_level = snapshot.val().toFixed(2);
            updateFuelChart(fuel_level);
        }
        else{
            var previousDate = getPreviousDate();
            firebase.database().ref("/" + previousDate + "/Mode1_PID47/fuel_level").on("value", function(snapshot){
                    fuel_level = snapshot.val().toFixed(2);
                    updateFuelChart(fuel_level);
            });
        }
    });
  
    // Auto load PID98
    firebase.database().ref("/" + currentDate + "/Mode1_PID98/torque_force").on("value", function(snapshot){
        if(snapshot.exists()){
            torque_force = snapshot.val().toFixed(2);
            updateTorqueForceChart(torque_force);
        }
        else{
            var previousDate = getPreviousDate();
            firebase.database().ref("/" + previousDate + "/Mode1_PID98/torque_force").on("value", function(snapshot){
                    torque_force = snapshot.val().toFixed(2);
                    updateTorqueForceChart(torque_force);
            });
        }
    });

    // Auto load PID02
    firebase.database().ref("/" + currentDate + "/Mode9_PID02/vin").on("value", function(snapshot){
        if(snapshot.exists()){
            vin = snapshot.val().substring(0, 3);
            checkVinAndDisplayImage(vin);
        }
        else{
            var previousDate = getPreviousDate();
            firebase.database().ref("/" + previousDate + "/Mode9_PID02/vin").on("value", function(snapshot){
                    vin = snapshot.val().substring(0, 3);
                    checkVinAndDisplayImage(vin);
            });
        }
    });

    // Auto load fault codes
    firebase.database().ref("/" + currentDate + "/MODE3_DATA").on("value", function(snapshot){
        fault_codes = []; 

        if (snapshot.exists()) {
            snapshot.forEach(function(childSnapshot) {
                var data = childSnapshot.val();
                fault_codes[data] = true;
            });
            displayDataInDatabox();
        }
        else{
            var previousDate = getPreviousDate();
            firebase.database().ref("/" + previousDate + "/MODE3_DATA").on("value", function(snapshot){
                    snapshot.forEach(function(childSnapshot) {
                        var data = childSnapshot.val();
                        fault_codes[data] = true;
                    });
                    displayDataInDatabox();
            });
        }
    });
    if(checkData == false){
        alert("Datas are invalid");
    }
}

// Gọi hàm cập nhật dữ liệu từ Firebase
updateFirebaseData();

function checkVinAndDisplayImage(vin) {
    var checkVin = [
        { condition: '1FA', src: 'img/ford.png' },
        { condition: '5TD', src: 'img/toyota.png' },
        { condition: 'RN2', src: 'img/mazda.jpg'}
    ];
    
    for (let i = 0; i < checkVin.length; i++) {
        if (vin === checkVin[i].condition) {
            carImage.src = checkVin[i].src;
            carImage.style.display = 'block';
            break;
        } else {
            carImage.style.display = 'none'; // Hide image if no condition is met
        }
    }
}

//Auto load car's position
firebase.database().ref("/car").on("value", function(snapshot) {
    var carData = snapshot.val();
    if (carData) {
        var lat_fb = carData.lat;
        var lng_fb = carData.lng;
        lat = lat_fb;
        lng = lng_fb;
        updateMapLocation(lat, lng);
    }
});

function updateMapLocation(lat, lng) {
    // Create new map object if it does not exist
    if (!map) {
        map = L.map('map').setView([lat, lng], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        marker = L.marker([lat, lng]).addTo(map);
    } else { // If map existed, update position of marker and move view to marker's position
        marker.setLatLng([lat, lng]);
        map.setView([lat, lng], 13);
    }
}


// Khởi tạo biểu đồ tốc độ
function initSpeedChart() {
    var ctx = document.getElementById('speedChart').getContext('2d');
    speedChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Speed',
                data: [],
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
                pointRadius: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Cập nhật dữ liệu cho biểu đồ tốc độ
function updateSpeedChart(timeData, speedData) {
    speedChart.data.labels.push(timeData);
    speedChart.data.datasets[0].data.push(speedData);

    
    // Cập nhật biểu đồ
    speedChart.update();
}

// Tự động cập nhật biểu đồ sau mỗi khoảng thời gian
setInterval(function() {
    var timeData = new Date().toLocaleTimeString();
    updateSpeedChart(timeData, car_spd);
}, 2000);

function initSpeedDisplayChart() {
    const ctx = document.getElementById('speedDisplayChart').getContext('2d');
    const gradientSegment = ctx.createLinearGradient(0, 5, 200, 0);
    gradientSegment.addColorStop(0, 'red');
    gradientSegment.addColorStop(0.5, 'yellow');
    gradientSegment.addColorStop(1, 'green');

    const data = {
        labels: ['Speed'],
        datasets: [{
          label: 'Km/h',
          data: [0, 255],
          backgroundColor: [
            gradientSegment,
            'rgba(102, 102, 102, 0.2)'
          ],
          borderColor: [
            gradientSegment,
            'rgba(102, 102, 102, 0.2)'
          ],
          needleValue: car_spd,
          borderWidth: 1
        }]
    };
    
    const gaugeChartText = {
        id: 'gaugeChartText',
        beforeDatasetsDraw(chart, args, pluginOptions){
            const {ctx, data, chartArea: {top, bottom, left, right, width, height}, scales: {r}} = chart;
            ctx.save();
            const xCoor = chart.getDatasetMeta(0).data[0].x;
            const yCoor = chart.getDatasetMeta(0).data[0].y;

            function textLabel(text, x, y, fontSize, textBaseLine, textAlign){
                ctx.font = `${fontSize}px san-serif`;
                ctx.fillStyle = '#666';
                ctx.textBaseLine = textBaseLine;
                ctx.textAlign = textAlign;
                ctx.fillText(text, x, y);
            }
            textLabel(car_spd, xCoor, yCoor , '40', 'top', 'center');
        }
    }

      // config 
    const config = {
        type: 'doughnut',
        data,
        options: {
            circumference: 180,
            responsive: true,
            maintainAspectRatio: false,
            rotation: 270,
            cutout: '80%',
            aspectRatio: 2,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    filter: (tooltipItem) => {
                        return tooltipItem.dataIndex === 0;
                    }
                },
                title: {
                    display: true,
                    text: 'Speed (Km/h)'
                }
            }
        },
        plugins: [gaugeChartText]
        //plugins: [gaugeNeedle]
    };
    
      // render init block
      speedDisplayChart = new Chart(
        document.getElementById('speedDisplayChart'),
        config
      );
}

function updateSpeedDisplayChart(newSpeed) {
    
    // Calculate the remaining level to keep the doughnut chart structure
    var remainingLevel = 255 - newSpeed;

    // Update the chart data
    speedDisplayChart.data.datasets[0].data[0] = newSpeed;
    speedDisplayChart.data.datasets[0].data[1] = remainingLevel;

    if (car_spd > 70){
        alert("The speed is too high!");
    }
    // Update the chart to reflect the new data
    speedDisplayChart.update();
}

function initFuelChart() {
    const ctx = document.getElementById('fuelChart').getContext('2d');
    const gradientSegment = ctx.createLinearGradient(0, 5, 200, 0);
    gradientSegment.addColorStop(0, 'red');
    gradientSegment.addColorStop(0.5, 'yellow');
    gradientSegment.addColorStop(1, 'green');

    const data = {
        labels: ['Fuel level'],
        datasets: [{
          label: 'Level',
          data: [0, 100],
          backgroundColor: [
            gradientSegment,
            'rgba(102, 102, 102, 0.2)'
          ],
          borderColor: [
            gradientSegment,
            'rgba(102, 102, 102, 0.2)'
          ],
          borderWidth: 1
        }]
    };
    
    const gaugeChartText = {
        id: 'gaugeChartText',
        beforeDatasetsDraw(chart, args, pluginOptions){
            const {ctx, data, chartArea: {top, bottom, left, right, width, height}, scales: {r}} = chart;
            ctx.save();
            const xCoor = chart.getDatasetMeta(0).data[0].x;
            const yCoor = chart.getDatasetMeta(0).data[0].y;
            let rating;

            if(fuel_level <= 25.00){rating = 'Low'; }
            if(fuel_level > 25.00 && fuel_level < 90.00){rating = 'Normal'; }
            if(fuel_level > 90.00){rating = 'Full';}
            function textLabel(text, x, y, fontSize, textBaseLine, textAlign){
                ctx.font = `${fontSize}px san-serif`;
                ctx.fillStyle = '#666';
                ctx.textBaseLine = textBaseLine;
                ctx.textAlign = textAlign;
                ctx.fillText(text, x, y);
            }
            
            if (fuel_level > 100.00){
                textLabel(100.00, xCoor, yCoor, '40', 'top', 'center');
            }
            else{
                textLabel(fuel_level, xCoor, yCoor, '40', 'top', 'center');
            }
            textLabel(rating, xCoor, yCoor - 35, '15', 'bottom', 'center');
        }
    }

      // config 
    const config = {
        type: 'doughnut',
        data,
        options: {
            circumference: 180,
            responsive: true,
            maintainAspectRatio: false,
            rotation: 270,
            cutout: '80%',
            aspectRatio: 2,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    filter: (tooltipItem) => {
                        return tooltipItem.dataIndex === 0;
                    }
                },
                title: {
                    display: true,
                    text: 'Fuel Level (%)'
                }
            }
        },
        plugins: [gaugeChartText]
    };
    
      // render init block
      fuelChart = new Chart(
        document.getElementById('fuelChart'),
        config
      );
}

function updateFuelChart(newFuelLevel) {
    
    // Calculate the remaining level to keep the doughnut chart structure
    if (fuel_level > 100.00){
        fuelChart.data.datasets[0].data[0] = 100.00;
        fuelChart.data.datasets[0].data[1] = 0;
    }
    else{
        var remainingLevel = 100 - newFuelLevel;
        fuelChart.data.datasets[0].data[0] = newFuelLevel;
        fuelChart.data.datasets[0].data[1] = remainingLevel;
    }
    if (fuel_level < 10.00){
        alert("The fuel level is very low!");
    }
    // Update the chart to reflect the new data
    fuelChart.update();
}

function displayDataInDatabox() {
    var databox = document.getElementById("dataBox");
    databox.innerHTML = ""; // Xóa nội dung cũ

    for (var data in fault_codes) {
        var p = document.createElement("p");
        p.textContent = data;
        databox.appendChild(p);
    }
}

function initEngineLoadChart() {
    const ctx = document.getElementById('engineLoadChart').getContext('2d');
    const gradientSegment = ctx.createLinearGradient(0, 0, 200, 0);
    gradientSegment.addColorStop(0, 'green');
    gradientSegment.addColorStop(0.55, 'yellow');
    gradientSegment.addColorStop(1, 'red');
    

    const data = {
        labels: ['engine load level'],
        datasets: [{
          label: 'Level',
          data: [0, 100],
          backgroundColor: [
            gradientSegment,
            'rgba(102, 102, 102, 0.2)'
          ],
          borderColor: [
            gradientSegment,
            'rgba(102, 102, 102, 0.2)'
          ],
          borderWidth: 1
        }]
      };
    
    const gaugeChartText = {
        id: 'gaugeChartText',
        beforeDatasetsDraw(chart, args, pluginOptions){
            const {ctx, data, chartArea: {top, bottom, left, right, width, height}, scales: {r}} = chart;
            ctx.save();
            const xCoor = chart.getDatasetMeta(0).data[0].x;
            const yCoor = chart.getDatasetMeta(0).data[0].y;
            let rating;
            if(engine_load < 15.00){rating = 'Idle'};
            if(engine_load >= 15.00 && engine_load < 25.00){rating = 'Low'; }
            if(engine_load > 25.00 && engine_load < 50.00){rating = 'Normal'; }
            if(engine_load > 50.00 && engine_load < 80.00){rating = 'High'; }
            if(engine_load > 80.00){rating = 'Maximum';}
            function textLabel(text, x, y, fontSize, textBaseLine, textAlign){
                ctx.font = `${fontSize}px san-serif`;
                ctx.fillStyle = '#666';
                ctx.textBaseLine = textBaseLine;
                ctx.textAlign = textAlign;
                ctx.fillText(text, x, y);
            }

            if (engine_load > 100.00){
                textLabel(100.00, xCoor, yCoor, '40', 'top', 'center');
            }
            else{
                textLabel(engine_load, xCoor, yCoor, '40', 'top', 'center');
            }
            textLabel(rating, xCoor, yCoor - 35, '15', 'bottom', 'center');
        }
    }

      // config 
    const config = {
    type: 'doughnut',
    data,
    options: {
        circumference: 180,
        responsive: true,
        maintainAspectRatio: false,
        rotation: 270,
        cutout: '80%',
        aspectRatio: 2,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                filter: (tooltipItem) => {
                    return tooltipItem.dataIndex === 0;
                }
            },
            title: {
                display: true,
                text: 'Engine Load (%)'
            }
            
        }
    },
    plugins: [gaugeChartText]
    };
    
    // render init block
    engineLoadChart = new Chart(
    document.getElementById('engineLoadChart'),
    config
    );
}

function updateEngineLoadChart(newEngineLoadlLevel) {
    
    // Calculate the remaining level to keep the doughnut chart structure
    if (engine_load > 100.00){
        engineLoadChart.data.datasets[0].data[0] = 100.00;
        engineLoadChart.data.datasets[0].data[1] = 0;
    }
    else{
        var remainingLevel = 100 - newEngineLoadlLevel;

        // Update the chart data
        engineLoadChart.data.datasets[0].data[0] = newEngineLoadlLevel;
        engineLoadChart.data.datasets[0].data[1] = remainingLevel;
    }

    if (engine_load >= 95){
        alert("Percentage engine load is too high!");
    }
    // Update the chart to reflect the new data
    engineLoadChart.update();
}

function initTorqueForceChart() {
    const ctx = document.getElementById('torqueForceChart').getContext('2d');
    const gradientSegment = ctx.createLinearGradient(0, 0, 200, 0);
    gradientSegment.addColorStop(0, 'green');
    gradientSegment.addColorStop(0.55, 'yellow');
    gradientSegment.addColorStop(1, 'red');

    const data = {
        labels: ['torque force level'],
        datasets: [{
          label: 'Level',
          data: [0, 100],
          backgroundColor: [
            gradientSegment,
            'rgba(102, 102, 102, 0.2)'
          ],
          borderColor: [
            gradientSegment,
            'rgba(102, 102, 102, 0.2)'
          ],
          borderWidth: 1
        }]
      };
    
    const gaugeChartText = {
        id: 'gaugeChartText',
        beforeDatasetsDraw(chart, args, pluginOptions){
            const {ctx, data, chartArea: {top, bottom, left, right, width, height}, scales: {r}} = chart;
            ctx.save();
            const xCoor = chart.getDatasetMeta(0).data[0].x;
            const yCoor = chart.getDatasetMeta(0).data[0].y;
            let rating;
                if(torque_force < 10.00){rating = 'Idle'};
                if(torque_force >= 10.00 && torque_force < 20.00){rating = 'Low'; }
                if(torque_force >= 20.00 && torque_force < 50.00){rating = 'Normal'; }
                if(torque_force > 50.00 && torque_force < 80.00){rating = 'High'; }
                if(torque_force > 80.00){rating = 'Maximum';}
            function textLabel(text, x, y, fontSize, textBaseLine, textAlign){
                ctx.font = `${fontSize}px san-serif`;
                ctx.fillStyle = '#666';
                ctx.textBaseLine = textBaseLine;
                ctx.textAlign = textAlign;
                ctx.fillText(text, x, y);
            }
            if (torque_force > 100.00){
                textLabel(100.00, xCoor, yCoor, '40', 'top', 'center');
            }
            else
                textLabel(torque_force, xCoor, yCoor, '40', 'top', 'center');
            textLabel(rating, xCoor, yCoor - 35, '15', 'bottom', 'center');
        }
    }

      // config 
    const config = {
    type: 'doughnut',
    data,
    options: {
        circumference: 180,
        responsive: true,
        maintainAspectRatio: false,
        rotation: 270,
        cutout: '80%',
        aspectRatio: 2,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                filter: (tooltipItem) => {
                    return tooltipItem.dataIndex === 0;
                }
            },
            title: {
                display: true,
                text: 'Torque Force (%)'
            }
            
        }
    },
    plugins: [gaugeChartText]
    };
    
    // render init block
    torqueForceChart = new Chart(
    document.getElementById('torqueForceChart'),
    config
    );
}

function updateTorqueForceChart(newEngineLoadlLevel) {
    
    // Calculate the remaining level to keep the doughnut chart structure
    if (torque_force > 100.00){  
        torqueForceChart.data.datasets[0].data[0] = 100.00;
        torqueForceChart.data.datasets[0].data[1] = 0;
    }
    else{
        var remainingLevel = 100 - newEngineLoadlLevel;

        // Update the chart data
        torqueForceChart.data.datasets[0].data[0] = newEngineLoadlLevel;
        torqueForceChart.data.datasets[0].data[1] = remainingLevel;
    }
    if (torque_force >= 95){
        alert("Percentage torque is too high!");
    }
    // Update the chart to reflect the new data
    torqueForceChart.update();
}
