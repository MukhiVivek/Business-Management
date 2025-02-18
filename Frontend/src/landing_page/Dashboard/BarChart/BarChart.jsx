import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { dataset, valueFormatter } from './dataset/weather';

const chartSetting = {
  yAxis: [
    {
      label: 'Latest Sales (₹)',
    },
  ],
  width: 600,
  margin: { left: 100, right: 50 },
  height: 280,
  sx: {
    [`.${axisClasses.left} .${axisClasses.label}`]: {
      transform: 'translate(-20px, 0px)',
    },
  },
};

export default function BarsDataset() {
  return (
    <BarChart
      className='items-center bg-gray-100 rounded-md shadow-md'
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