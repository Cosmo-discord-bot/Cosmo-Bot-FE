import { Component, OnDestroy, OnInit } from '@angular/core';
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
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectSelectedGuildId } from '@selectors/guild.selectors';

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
    selector: 'app-messages-per-user',
    providers: [GraphDataService],
    templateUrl: './messages-per-user.component.html',
    styleUrls: ['./messages-per-user.component.scss'],
    standalone: true,
    imports: [NgApexchartsModule, CommonModule],
})
export class MessagesPerUserComponent implements OnInit, OnDestroy {
    public chartOptions: Partial<ChartOptions> | any;
    guildId: string | null = null;
    private guildSubscription: Subscription | null = null;

    topUsers: { name: string; count: number }[] = [];
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

        this.graphDataService.getMessagesPerUserChartData(this.guildId ?? '', days).subscribe({
            next: (data) => {
                const users = data.map((user: { name: string; count: number }) => ({
                    name: user.name,
                    count: user.count,
                }));

                this.topUsers = users.sort((a: any, b: any) => b.count - a.count).slice(0, 10);

                const seriesData = users.map((user: any) => user.count);
                const labels = users.map((user: any) => user.name);

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
