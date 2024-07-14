import { Component, OnInit } from '@angular/core';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexTitleSubtitle, ApexTooltip, ApexXAxis, ApexYAxis, NgApexchartsModule } from 'ng-apexcharts';
import { GraphDataService } from '../../../services/graph-data.service';

export type ChartOptions = {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    xaxis: ApexXAxis;
    yaxis: ApexYAxis;
    dataLabels: ApexDataLabels;
    title: ApexTitleSubtitle;
    tooltip: ApexTooltip;
};

@Component({
    selector: 'app-messages-per-day',
    standalone: true,
    providers: [GraphDataService],
    templateUrl: './messages-per-day.component.html',
    styleUrl: './messages-per-day.component.scss',
    imports: [NgApexchartsModule],
})
export class MessagesPerDayComponent implements OnInit {
    public chartOptions!: Partial<ChartOptions> | any;

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
                const seriesData = data.map((item: any) => ({ x: item.x, y: item.y }));
                this.initChart(seriesData);
            },
            error: (error) => {
                console.error('Error fetching chart data:', error);
            },
        });
    }

    private initChart(data: any) {
        this.chartOptions = {
            series: [
                {
                    name: 'Message Count',
                    data: data,
                },
            ],
            chart: {
                type: 'bar',
                height: 350,
                toolbar: {
                    show: false, // Disable the toolbar
                },
            },
            xaxis: {
                type: 'datetime',
                title: {
                    text: 'Date',
                },
            },
            yaxis: {
                title: {
                    text: 'Message Count',
                },
                min: 0,
            },
            dataLabels: {
                enabled: false,
            },
            title: {
                text: 'Messages Per Day',
                align: 'center',
            },
            tooltip: {
                x: {
                    format: 'dd MMM yyyy',
                    color: '#000000',
                },
            },
        };
    }
}
