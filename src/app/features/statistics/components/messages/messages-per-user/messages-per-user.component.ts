import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';
import { GraphDataService } from '../../../services/graph-data.service';
import { CommonModule } from '@angular/common';

interface IChartData {
    name: string;
    count: number;
}

@Component({
    selector: 'app-messages-per-user',
    providers: [GraphDataService],
    imports: [BaseChartDirective, CommonModule],
    templateUrl: './messages-per-user.component.html',
    styleUrls: ['./messages-per-user.component.scss'],
    standalone: true,
})
export class MessagesPerUserComponent implements OnInit {
    @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

    public chartData: ChartConfiguration['data'] = {
        datasets: [
            {
                data: [],
                label: 'Message Count',
                backgroundColor: [],
            },
        ],
        labels: [],
    };

    public chartOptions: ChartConfiguration['options'] = {
        responsive: true,
        plugins: {
            legend: { display: true },
        },
    };

    public chartType: ChartType = 'pie';

    topUsers: { name: string; count: number }[] = [];

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

        this.graphDataService.getPerUserChartData(days).subscribe({
            next: (data) => {
                const users = data.map((user: { name: string; count: number }) => ({
                    name: user.name,
                    count: user.count,
                }));

                this.topUsers = users.sort((a: IChartData, b: IChartData) => b.count - a.count).slice(0, 10);

                this.chartData.datasets[0].data = users.map((user: IChartData) => user.count);
                this.chartData.labels = users.map((user: IChartData) => user.name);
                const colors = this.generateContrastingColors(120, users.length);
                this.chartData.datasets[0].backgroundColor = users.map((_: IChartData, i: number) => colors[i]);

                if (this.chart) {
                    this.chart.chart?.update();
                }
            },
            error: (error) => {
                console.error('Error fetching chart data:', error);
            },
        });
    }

    private generateContrastingColors(baseHue: number, numberOfColors: number): string[] {
        const colors = [];
        const step = Math.floor(360 / numberOfColors); // Dynamic step size

        for (let i = 0; i < numberOfColors; i++) {
            const hue = (baseHue + i * step) % 360;
            colors.push(`hsl(${hue}, 50%, 50%)`);
        }
        return colors;
    }
}
