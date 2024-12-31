import { XAxis, YAxis } from 'recharts';

interface ChartAxisProps {
  xAxisDataKey: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
}

export function ChartAxis({ xAxisDataKey, xAxisLabel, yAxisLabel }: ChartAxisProps) {
  return (
    <>
      <XAxis 
        dataKey={xAxisDataKey}
        stroke="#9CA3AF"
        tick={{ fill: '#9CA3AF' }}
        label={xAxisLabel ? { value: xAxisLabel, position: 'bottom', fill: '#9CA3AF' } : undefined}
      />
      <YAxis
        stroke="#9CA3AF"
        tick={{ fill: '#9CA3AF' }}
        label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'left', fill: '#9CA3AF' } : undefined}
      />
    </>
  );
}