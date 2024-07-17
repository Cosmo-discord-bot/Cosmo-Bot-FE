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
    selector: 'app-voice-per-day',
    standalone: true,
    providers: [GraphDataService],
    templateUrl: './voice-per-day.component.html',
    styleUrl: './voice-per-day.component.scss',
    imports: [NgApexchartsModule],
})
export class VoicePerDayComponent implements OnInit {
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

        this.graphDataService.getVoicePerChannelChartData(days).subscribe((data) => {
            const processedData = this.processChartData(data);
            this.initChart(processedData);
        });
    }

    private processChartData(data: { date: string; userData: { [userId: string]: number } }[]): {
        x: number;
        y: number;
    }[] {
        return data
            .map((item) => ({
                x: new Date(item.date).getTime(),
                y: Object.values(item.userData).reduce((sum: number, hours: number) => sum + hours, 0),
            }))
            .sort((a, b) => a.x - b.x); // Sort by date
    }

    private initChart(data: { x: number; y: number }[]) {
        this.chartOptions = {
            series: [
                {
                    name: 'Total Voice Hours',
                    data: data,
                },
            ],
            chart: {
                type: 'bar',
                height: 350,
                toolbar: {
                    show: false,
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
                    text: 'Total Voice Hours',
                },
                min: 0,
            },
            dataLabels: {
                enabled: false,
            },
            title: {
                text: 'Voice Activity Per Day',
                align: 'center',
            },
            tooltip: {
                x: {
                    format: 'dd MMM yyyy',
                },
                y: {
                    formatter: function (value: number) {
                        return value.toFixed(2) + ' hours';
                    },
                },
            },
        };
    }
}
