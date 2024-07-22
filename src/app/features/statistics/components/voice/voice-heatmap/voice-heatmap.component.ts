import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexPlotOptions, ApexTooltip, ApexXAxis, ApexYAxis, NgApexchartsModule } from 'ng-apexcharts';
import { GraphDataService } from '../../../services/graph-data.service';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectSelectedGuildId } from '@selectors/guild.selectors';

export type ChartOptions = {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    xaxis: ApexXAxis;
    plotOptions: ApexPlotOptions;
    dataLabels: ApexDataLabels;
    yaxis: ApexYAxis;
    tooltip: ApexTooltip;
};

@Component({
    selector: 'app-voice-heatmap',
    templateUrl: './voice-heatmap.component.html',
    styleUrls: ['./voice-heatmap.component.scss'],
    providers: [GraphDataService],
    standalone: true,
    imports: [NgApexchartsModule],
})
export class VoiceHeatmapComponent implements OnInit, OnDestroy {
    public chartOptions: Partial<ChartOptions> | any;
    guildId: string | null = null;
    private guildSubscription: Subscription | null = null;

    constructor(
        private graphDataService: GraphDataService,
        private store: Store
    ) {}

    ngOnInit() {
        this.guildSubscription = this.store.select(selectSelectedGuildId).subscribe((guildId) => {
            if (guildId && guildId !== this.guildId) {
                this.guildId = guildId;
                this.graphDataService.getMessagesActivityHeatmap(this.guildId, '30').subscribe((data) => {
                    const transformedData = this.transformData(data);
                    this.initChart(transformedData);
                });
            }
        });
    }

    transformData(data: any) {
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        const series = [];

        for (let i = 0; i < 7; i++) {
            const dataForDay = [];
            for (let j = 0; j < 24; j++) {
                dataForDay.push({
                    x: j,
                    y: data[days[i]][j.toString()],
                });
            }
            series.push({
                name: days[i],
                data: dataForDay,
            });
        }

        return series;
    }

    initChart(series: { name: string; data: { x: number; y: number }[] }[]) {
        const maxValue = Math.max(...series.flatMap((day) => day.data.map((point) => point.y)));

        this.chartOptions = {
            series: series,
            chart: {
                type: 'heatmap',
                height: 350,
                toolbar: {
                    show: false,
                },
                zoom: {
                    enabled: false,
                },
            },
            plotOptions: {
                heatmap: {
                    enableShades: true,
                    shadeIntensity: 1,
                    colorScale: {
                        ranges: [
                            { from: 0, to: 0, name: 'No Activity', color: '#e0e0e0' },
                            { from: 1, to: maxValue, name: 'Activity', color: '#008FFB' },
                        ],
                    },
                },
            },
            dataLabels: {
                enabled: true,
            },
            xaxis: {
                type: 'numeric',
                title: {
                    text: 'Hour of the Day',
                },
                labels: {
                    formatter: (val: string) => Math.floor(parseInt(val)).toString(),
                    show: true,
                },
                categories: Array.from({ length: 24 }, (_, i) => i),
                tooltip: {
                    enabled: false,
                },
            },
            yaxis: {
                reversed: true,
                title: {
                    text: 'Day of the Week',
                },
                labels: {
                    show: true,
                },
            },
            tooltip: {
                enabled: true,
                theme: 'dark',
                style: {
                    fontSize: '12px',
                    fontFamily: 'Helvetica, Arial, sans-serif',
                },
            },
            legend: {
                show: false, // Disable the legend
            },
            title: {
                text: 'Messages Heatmap',
                align: 'center',
                style: {
                    fontSize: '16px',
                    color: '#fff',
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
