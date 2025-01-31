async function fetchLogs() {
    const response = await fetch("/api/logs");
    return await response.json();
}

async function renderChart() {
    const logs = await fetchLogs();

    const timestamps = logs.map(log => new Date(log.timestamp).toLocaleTimeString());
    const connections = logs.map(log => log.numberOfConnections);
    const throughput = logs.map(log => log.throughput);

    const ctx = document.getElementById("chart").getContext("2d");
    const chart = new Chart(ctx, {
        type: "line",
        data: {
            labels: timestamps,
            datasets: [
                {
                    label: "Number of Connections",
                    data: connections,
                    borderColor: "blue",
                    fill: false,
                },
                {
                    label: "Throughput",
                    data: throughput,
                    borderColor: "green",
                    fill: false,
                },
            ],
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: "Time",
                    },
                },
                y: {
                    title: {
                        display: true,
                        text: "Value",
                    },
                    ticks: {
                        stepSize: 2, 
                    },
                },
            },
        },
    });

    setInterval(async () => {
        const newLogs = await fetchLogs();
        const newTimestamps = newLogs.map(log => new Date(log.timestamp).toLocaleTimeString());
        const newConnections = newLogs.map(log => log.numberOfConnections);
        const newThroughput = newLogs.map(log => log.throughput);

        chart.data.labels = newTimestamps;
        chart.data.datasets[0].data = newConnections;
        chart.data.datasets[1].data = newThroughput;
        chart.update();
    }, 1000);
}

renderChart();