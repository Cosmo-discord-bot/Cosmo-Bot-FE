import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartType } from 'chart.js';
import { GraphDataService } from '../../../services/graph-data.service';
import { BaseChartDirective } from 'ng2-charts';

@Component({
    selector: 'app-messages-per-day',
    standalone: true,
    imports: [BaseChartDirective],
    providers: [GraphDataService],
    templateUrl: './messages-per-day.component.html',
    styleUrl: './messages-per-day.component.scss',
})
export class MessagesPerDayComponent implements OnInit {
    @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

    public chartData: ChartConfiguration['data'] = {
        datasets: [
            {
                data: [],
                label: 'Message Count',
                //backgroundColor: 'rgba(75,192,192,0.4)',
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

    public chartOptions: ChartConfiguration['options'] = {
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

    public chartType: ChartType = 'bar';

    timeFilter: string = 'month';

    constructor(private graphDataService: GraphDataService) {}

    ngOnInit(): void {
        this.updateTimeFilter('month');
    }

    updateTimeFilter(filter: string): void {
        this.timeFilter = filter;
        let days: string;

        switch (filter) {
            case 'week':
                days = '7';
                break;
            case 'month':
                days = '30';
                break;
            case 'year':
                days = '365';
                break;
            default:
                days = '30';
        }

        this.graphDataService.getPerDayChartData(days).subscribe({
            next: (data) => {
                if (this.chartData.datasets) {
                    this.chartData.datasets[0].data = data;
                }
                this.chartData.labels = data.map((item: any) => item.x);

                if (this.chart) {
                    this.chart.chart?.update();
                }
            },
            error: (error) => {
                console.error('Error fetching chart data:', error);
            },
        });
    }
}
/*
        TODO:
        - Messages for 30 days with filter for more - max 365 days
        - Messages per channel
        - Messages per user
        - Heatmap - how many messages-per-day each hour of the day
        - Top 10 users by messages-per-day - pie chart with percentage
        - Top 10 channels by messages-per-day - pie chart with percentage

        - Average?
     */
