import React from 'react';
import { Bar } from 'react-chartjs-2';

const Chart = () => {
    const chartData = {
        labels: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
        datasets: [
            {
                label: '매출액 (억 원)',
                data: [12, 19, 3, 5, 2, 3, 7, 8, 5, 9, 10, 14],
                backgroundColor: 'rgba(0, 123, 255, 0.8)',
                borderColor: 'rgba(0, 123, 255, 1)',
                borderWidth: 1,
                type: 'bar',
            },
            {
                label: '전년 대비 (%)',
                data: [5, 15, -3, -5, 2, 10, 7, 12, 5, -2, 0, 4],
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 2,
                fill: false,
                type: 'line',
            },
        ],
    };

    const options = {
        responsive: true,
        scales: {
            x: { grid: { display: false } },
            y: { beginAtZero: true, grid: { color: '#e0e0e0' } },
        },
        plugins: {
            legend: { position: 'top', labels: { color: '#333' } },
        },
    };

    return <Bar data={chartData} options={options} />;
};

export default Chart;
