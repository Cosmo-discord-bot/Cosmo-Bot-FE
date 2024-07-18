import { Component, OnInit } from '@angular/core';
import {
    ApexAxisChartSeries,
    ApexChart,
    ApexDataLabels,
    ApexLegend,
    ApexPlotOptions,
    ApexTitleSubtitle,
    ApexXAxis,
    ApexYAxis,
    NgApexchartsModule,
} from 'ng-apexcharts';
import { GraphDataService } from '../../../services/graph-data.service';
import { CommonModule } from '@angular/common';

export type ChartOptions = {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    xaxis: ApexXAxis;
    yaxis: ApexYAxis;
    dataLabels: ApexDataLabels;
    title: ApexTitleSubtitle;
    legend: ApexLegend;
    plotOptions: ApexPlotOptions;
    labels: any;
};

@Component({
    selector: 'app-voice-per-channel',
    providers: [GraphDataService],
    templateUrl: './voice-per-channel.component.html',
    styleUrls: ['./voice-per-channel.component.scss'],
    standalone: true,
    imports: [NgApexchartsModule, CommonModule],
})
export class VoicePerChannelComponent implements OnInit {
    public chartOptions: Partial<ChartOptions> | any;

    topChannels: { name: string; hours: number }[] = [];
    timeFilter: string = 'month';

    constructor(private graphDataService: GraphDataService) {}

    ngOnInit(): void {
        this.updateTimeFilter(this.timeFilter);
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

        this.graphDataService.getVoicePerChannelChartData(days).subscribe({
            next: (data) => {
                const channels = this.processVoiceData(data);

                this.topChannels = channels.sort((a, b) => b.hours - a.hours).slice(0, 10);

                const seriesData = this.topChannels.map((channel) => channel.hours);
                const labels = this.topChannels.map((channel) => channel.name);

                this.chartOptions = {
                    series: seriesData,
                    chart: {
                        type: 'pie',
                        height: '425',
                        toolbar: {
                            show: false,
                        },
                    },
                    labels: labels,
                    dataLabels: {
                        enabled: true,
                        formatter: (val: number, opts: any) => {
                            return `${val.toFixed(1)}%`;
                        },
                    },
                    title: {
                        text: 'Top 10 Voice Channels by Usage',
                        align: 'center',
                    },
                    legend: {
                        position: 'bottom',
                    },
                    plotOptions: {
                        pie: {
                            dataLabels: {
                                offset: -5,
                            },
                        },
                    },
                };
            },
            error: (error) => {
                console.error('Error fetching chart data:', error);
            },
        });
    }

    private processVoiceData(data: { [date: string]: { [channelName: string]: number } }): {
        name: string;
        hours: number;
    }[] {
        const channelTotals: { [channelName: string]: number } = {};

        Object.values(data).forEach((dayData) => {
            Object.entries(dayData).forEach(([channelName, hours]) => {
                if (!channelTotals[channelName]) {
                    channelTotals[channelName] = 0;
                }
                channelTotals[channelName] += hours;
            });
        });

        return Object.entries(channelTotals).map(([name, hours]) => ({ name, hours }));
    }
}
