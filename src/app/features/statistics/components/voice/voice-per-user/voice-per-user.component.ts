import { Component, OnInit } from '@angular/core';
import { ApexChart, ApexDataLabels, ApexLegend, ApexNonAxisChartSeries, NgApexchartsModule } from 'ng-apexcharts';
import { GraphDataService } from '../../../services/graph-data.service';
import { CommonModule } from '@angular/common';

interface IChartData {
    name: string;
    hours: number;
}

export type ChartOptions = {
    series: ApexNonAxisChartSeries;
    chart: ApexChart;
    labels: any;
    dataLabels: ApexDataLabels;
    legend: ApexLegend;
};

@Component({
    selector: 'app-voice-per-user',
    providers: [GraphDataService],
    templateUrl: './voice-per-user.component.html',
    styleUrl: './voice-per-user.component.scss',
    standalone: true,
    imports: [NgApexchartsModule, CommonModule],
})
export class VoicePerUserComponent implements OnInit {
    public chartOptions: Partial<ChartOptions> | any;

    topUsers: IChartData[] = [];

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

        this.graphDataService.getVoicePerUserChartData(days).subscribe({
            next: (data) => {
                const processedData = this.processVoiceData(data);
                this.topUsers = processedData.sort((a, b) => b.hours - a.hours).slice(0, 10);

                const chartData = this.topUsers.map((channel) => channel.hours);
                const chartLabels = this.topUsers.map((channel) => channel.name);
                this.chartOptions = {
                    series: chartData,
                    chart: {
                        type: 'pie',
                        height: 425,
                        toolbar: {
                            show: false,
                        },
                    },
                    labels: chartLabels,
                    dataLabels: {
                        enabled: true,
                        formatter: function (val: number, opts: any) {
                            return opts.w.config.series[opts.seriesIndex].toFixed(2) + ' hours';
                        },
                    },
                    title: {
                        text: 'Top 10 Channels by Voice Activity',
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

    private processVoiceData(data: { date: string; userData: { [userId: string]: number } }[]): IChartData[] {
        const usersTotals: { [channelId: string]: number } = {};

        data.forEach((dayData) => {
            Object.entries(dayData.userData).forEach(([userid, hours]) => {
                if (!usersTotals[userid]) {
                    usersTotals[userid] = 0;
                }
                usersTotals[userid] += hours;
            });
        });

        return Object.entries(usersTotals).map(([userid, hours]) => ({
            name: userid, // You might want to replace this with actual channel names if available
            hours: hours,
        }));
    }
}
