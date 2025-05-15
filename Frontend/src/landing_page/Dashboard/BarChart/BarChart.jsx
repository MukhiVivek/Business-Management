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
  width: undefined,   
  height: 300,
  margin: { left: 70, right: 30, top: 20, bottom: 40 },
  sx: {
    [`.${axisClasses.left} .${axisClasses.label}`]: {
      transform: 'translate(-20px, 0px)',
    },
  },
};

export default function BarsDataset() {
  return (
    <div className="w-full bg-white p-6 rounded-2xl shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Sales by Region</h2>
      <div className="w-full overflow-x-auto">
        <BarChart
          className="rounded-xl"
          xAxis={[{ scaleType: 'band', dataKey: 'month' }]}
          dataset={dataset}
          series={[
            {
              dataKey: 'ahmedabad',
              label: 'Ahmedabad',
              valueFormatter,
              color: '#34D399',   
            },
            {
              dataKey: 'mumbai',
              label: 'Mumbai',
              valueFormatter,
              color: '#60A5FA',   
            },
          ]}
          {...chartSetting}
        />
      </div>
    </div>
  );
}
