import { Component, OnInit, ViewChild } from '@angular/core';
import { GraphDataService } from '../../../services/graph-data.service';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
interface ChartData {
    [dayOfWeek: string]: {
        [hour: string]: number;
    };
}

@Component({
    selector: 'app-messages-heatmap',
    providers: [GraphDataService],
    standalone: true,
    imports: [CommonModule, BaseChartDirective],
    templateUrl: './messages-heatmap.component.html',
    styleUrl: './messages-heatmap.component.scss',
})
export class MessagesHeatmapComponent implements OnInit {
    @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

    public chartData: ChartConfiguration['data'] = {
        datasets: [
            {
                data: [],
                backgroundColor: [],
                hoverBackgroundColor: [],
            },
        ],
    };

    public chartOptions: ChartConfiguration['options'] = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                type: 'linear',
                position: 'bottom',
                min: -0.5,
                max: 6.5,
                ticks: {
                    stepSize: 1,
                    callback: (value) => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][value],
                },
            },
            y: {
                type: 'linear',
                min: -0.5,
                max: 23.5,
                ticks: {
                    stepSize: 1,
                    callback: (value) => `${value}:00`,
                },
            },
        },
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    title: (context) => {
                        const day = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][context[0].parsed.x];
                        const hour = context[0].parsed.y;
                        return `${day} ${hour}:00`;
                    },
                    //label: (context) => `Messages: ${context.raw.v}`,
                },
            },
        },
    };

    public chartType: ChartType = 'scatter';

    constructor(private graphDataService: GraphDataService) {}

    ngOnInit() {
        this.graphDataService.getActivityHeatmap('30').subscribe((data) => {
            this.updateChartData(data);
        });
    }

    private updateChartData(data: { [dayOfWeek: string]: { [hour: string]: number } }) {
        const chartData = [];
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        let maxValue = 0;

        for (let x = 0; x < 7; x++) {
            for (let y = 0; y < 24; y++) {
                const value = data[days[x]][y.toString()] || 0;
                maxValue = Math.max(maxValue, value);
                chartData.push({ x, y, v: value });
            }
        }

        this.chartData.datasets[0].data = chartData;
        this.chartData.datasets[0].backgroundColor = chartData.map((d) => this.getColor(d.v, maxValue, 0.7));
        this.chartData.datasets[0].hoverBackgroundColor = chartData.map((d) => this.getColor(d.v, maxValue, 1));
        // this.chartData.datasets[0].pointRadius = 10;

        if (this.chart) {
            this.chart.chart?.update();
        }
    }

    private getColor(value: number, maxValue: number, alpha: number): string {
        const intensity = value / maxValue;
        const r = Math.round(intensity * 255);
        const g = Math.round((1 - intensity) * 255);
        return `rgba(${r}, ${g}, 0, ${alpha})`;
    }
}
