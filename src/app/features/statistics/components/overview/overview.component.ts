import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import 'chartjs-adapter-date-fns';
import { GraphDataService } from '../../services/graph-data.service'; // Update this path

@Component({
    selector: 'app-overview',
    templateUrl: './overview.component.html',
    styleUrls: ['./overview.component.scss'],
    providers: [GraphDataService],
})
export class OverviewComponent implements OnInit {
    @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

    public lineChartData: ChartConfiguration['data'] = {
        datasets: [
            {
                data: [],
                label: 'Message Count',
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

    public lineChartType: ChartType = 'bar';

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

        this.graphDataService.getLineChartData(days).subscribe({
            next: (data) => {
                if (this.lineChartData.datasets) {
                    this.lineChartData.datasets[0].data = data;
                }
                this.lineChartData.labels = data.map((item: any) => item.x);

                if (this.chart) {
                    this.chart.chart?.update();
                }
            },
            error: (error) => {
                console.error('Error fetching chart data:', error);
                // Handle error (e.g., show an error message to the user)
            },
        });
    }
}
