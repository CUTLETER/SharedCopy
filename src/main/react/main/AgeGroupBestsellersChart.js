// src/components/AgeGroupBestsellersChart.js
import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const AgeGroupBestsellersChart = () => {
    const data = {
        labels: ['10대', '20대', '30대', '40대', '50대 이상'],
        datasets: [{
            data: [10, 20, 30, 25, 15],
            backgroundColor: ['#0056b3', '#f05454', '#ffa41b', '#4caf50', '#ff7f50'],
        }]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    color: '#333'
                }
            }
        }
    };

    return <Doughnut data={data} options={options} />;
};

export default AgeGroupBestsellersChart;
