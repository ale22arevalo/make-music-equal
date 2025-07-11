"use strict";

import {fetchData} from '../components/utils.js'

export async function renderCareerChart() {

    const url = 'https://chartmetric-public.s3.us-west-2.amazonaws.com/make-music-equal/mme_career_stage.csv';
    const metric = 'career_stage';

    const data = await fetchData(url, metric);

    if (!data.length) return;

    const labels = [];
    const datasets = [];

    const canvas = document.getElementById('career-stage-chart');
    if (!canvas) {
        console.error('Canvas not found');
        return;
    }

    const ctx = canvas.getContext('2d');
    const orangeGr = ctx.createLinearGradient(0, 0, 0, 400);
    orangeGr.addColorStop(0, '#F0899A'); // Start color
    orangeGr.addColorStop(1, '#EEC23F'); // End color

    const blueGr = ctx.createLinearGradient(0, 0, 0, 400);
    blueGr.addColorStop(0, '#C0E7F4'); // Start color
    blueGr.addColorStop(1, '#A0B1FF'); // End color

    const baseColors = [blueGr, orangeGr,'#E2EF70']; // he/him, she/her, they/them and other pronouns

    data.forEach(stage => {
        labels.push(
            `${stage.career_stage}: he/him`,
            `${stage.career_stage}: she/her`,
            `${stage.career_stage}: they/them and other pronouns`
        );
        datasets.push({
            label: stage.career_stage,
            backgroundColor: baseColors,
            data: [stage.he_him, stage.she_her, stage.they_them_other_pronouns]
        });
    });

    new Chart(ctx, {
        type: 'pie',
        data: {
            labels,
            datasets
        },
        options: {
            responsive: true,
            plugins: {
                tooltip: {
                    callbacks: {
                        title: function(context) {
                            const labelIndex = (context[0].datasetIndex * 3) + context[0].dataIndex;
                            return context[0].chart.data.labels[labelIndex];
                        },
                        label: context => {
                            let value = context.raw;
                            if (value >= 1000000) {
                                value = (value / 1000000).toFixed(1) + 'm';
                            } else if (value >= 1000) {
                                value = (value / 1000).toFixed(1) + 'k';
                            }
                            return `${value} artists`
                        }
                    }
                },
                legend: {
                    display: false
                }
            }
        }
    });
}
