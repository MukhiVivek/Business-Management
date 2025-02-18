import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { dataset, valueFormatter } from './dataset/weather';

const chartSetting = {
  yAxis: [
    {
      label: 'Recent Sales (₹)',
    },
  ],
  width: 500,
  height: 300,
  sx: {
    [`.${axisClasses.left} .${axisClasses.label}`]: {
      transform: 'translate(-20px, 0px)',
    },
  },
};

export default function BarsDataset() {
  return (
    <BarChart
      className='items-center'
      xAxis={[{ scaleType: 'band', dataKey: 'month' }]}
      dataset={dataset}
      series={[ 
        { dataKey: 'ahmedabad', label: 'Ahmedabad', valueFormatter },
        { dataKey: 'mumbai', label: 'Mumbai', valueFormatter },
        { dataKey: 'bangalore', label: 'Bangalore', valueFormatter },
        { dataKey: 'odisha', label: 'Odisha', valueFormatter },
      ]}
      {...chartSetting}
    />
  );
}