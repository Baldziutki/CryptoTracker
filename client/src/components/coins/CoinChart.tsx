import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

interface ChartOptions {
    title: {
        text: string;
    };
    xAxis: {
        type: string;
        title: {
            text: string;
        };
    };
    yAxis: {
        type: string;
        title: {
            text: string;
        };
    };
    series: {
        name: string;
        data: any;
        color: string;
    }[];
}

export default function CoinChart(options: ChartOptions) {

    return (
        <div className=''>
            <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
    );
}
