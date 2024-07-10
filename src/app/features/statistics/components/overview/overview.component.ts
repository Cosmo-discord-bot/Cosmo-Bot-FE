import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import 'chartjs-adapter-date-fns';

@Component({
    selector: 'app-overview',
    templateUrl: './overview.component.html',
    styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent implements OnInit {
    @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

    public lineChartData: ChartConfiguration['data'] = {
        datasets: [
            {
                data: [],
                label: 'Linear Function',
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'rgba(75,192,192,1)',
                pointBackgroundColor: 'rgba(75,192,192,1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(75,192,192,0.8)',
                fill: 'origin',
            },
        ],
        labels: [],
    };

    public lineChartOptions: ChartConfiguration['options'] = {
        responsive: true,
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'day',
                },
            },
            y: {
                beginAtZero: true,
            },
        },
        plugins: {
            legend: { display: true },
        },
    };

    public lineChartType: ChartType = 'line';

    timeFilter: string = 'month';

    constructor() {}

    ngOnInit(): void {
        this.updateTimeFilter('month');
    }

    generateData(startDate: Date, endDate: Date): { x: number; y: number }[] {
        const data = [];
        const daysDiff = (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24);

        for (let i = 0; i <= daysDiff; i++) {
            const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
            const value = i * 2; // Linear function: f(x) = 2x
            data.push({ x: date.getTime(), y: value });
        }

        return data;
    }

    updateTimeFilter(filter: string): void {
        this.timeFilter = filter;
        const endDate = new Date();
        let startDate: Date;

        switch (filter) {
            case 'week':
                startDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate() - 7);
                break;
            case 'month':
                startDate = new Date(endDate.getFullYear(), endDate.getMonth() - 1, endDate.getDate());
                break;
            case 'year':
                startDate = new Date(endDate.getFullYear() - 1, endDate.getMonth(), endDate.getDate());
                break;
            default:
                startDate = new Date(endDate.getFullYear(), endDate.getMonth() - 1, endDate.getDate());
        }

        const newData = this.generateData(startDate, endDate);

        if (this.lineChartData.datasets) {
            this.lineChartData.datasets[0].data = newData;
        }

        this.lineChartData.labels = newData.map((item) => new Date(item.x));

        if (this.chart) {
            this.chart.chart?.update();
        }
    }
}
