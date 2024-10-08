import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApexChart, ApexDataLabels, ApexLegend, ApexNonAxisChartSeries, NgApexchartsModule } from 'ng-apexcharts';
import { GraphDataService } from '../../../services/graph-data.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { selectSelectedGuildId } from '@selectors/guild.selectors';
import { Store } from '@ngrx/store';

interface IChartData {
    name: string;
    count: number;
}

export type ChartOptions = {
    series: ApexNonAxisChartSeries;
    chart: ApexChart;
    labels: any;
    dataLabels: ApexDataLabels;
    legend: ApexLegend;
};

@Component({
    selector: 'app-messages-per-channel',
    providers: [GraphDataService],
    templateUrl: './messages-per-channel.component.html',
    styleUrl: './messages-per-channel.component.scss',
    standalone: true,
    imports: [NgApexchartsModule, CommonModule],
})
export class MessagesPerChannelComponent implements OnInit, OnDestroy {
    public chartOptions: Partial<ChartOptions> | any;
    guildId: string | null = null;
    private guildSubscription: Subscription | null = null;

    topChannels: IChartData[] = [];

    timeFilter: string = 'month';

    constructor(
        private graphDataService: GraphDataService,
        private store: Store
    ) {}

    ngOnInit(): void {
        this.guildSubscription = this.store.select(selectSelectedGuildId).subscribe((guildId) => {
            if (guildId && guildId !== this.guildId) {
                this.guildId = guildId;
                this.updateTimeFilter(this.timeFilter);
            }
        });
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

        this.graphDataService.getMessagesPerChannelChartData(this.guildId ?? '', days).subscribe({
            next: (data) => {
                const channels = data.map((channel: { name: string; count: number }) => ({
                    name: channel.name,
                    count: channel.count,
                }));

                this.topChannels = channels.sort((a: IChartData, b: IChartData) => b.count - a.count).slice(0, 10);

                const chartData = this.topChannels.map((channel) => channel.count);
                const chartLabels = this.topChannels.map((channel) => channel.name);
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
                    },
                    title: {
                        text: 'Top 10 Users by Message Count',
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

    ngOnDestroy() {
        if (this.guildSubscription) {
            this.guildSubscription.unsubscribe();
        }
    }
}
