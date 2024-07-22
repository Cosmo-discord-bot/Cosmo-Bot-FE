import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexTitleSubtitle, ApexTooltip, ApexXAxis, ApexYAxis, NgApexchartsModule } from 'ng-apexcharts';
import { GraphDataService } from '../../../services/graph-data.service';
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
export class VoicePerDayComponent implements OnInit, OnDestroy {
    public chartOptions!: Partial<ChartOptions> | any;
    guildId: string | null = null;
    private guildSubscription: Subscription | null = null;

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

        this.graphDataService.getVoicePerUserChartData(this.guildId ?? '', days).subscribe((data) => {
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
                        return value.toFixed(0) + ' hours';
                    },
                },
            },
        };
    }

    ngOnDestroy() {
        if (this.guildSubscription) {
            this.guildSubscription.unsubscribe();
        }
    }
}
