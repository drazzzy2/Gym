import { Tooltip, TooltipProps } from 'recharts';

interface ChartTooltipConfig {
  labelStyle?: React.CSSProperties;
  contentStyle?: React.CSSProperties;
  itemStyle?: React.CSSProperties;
}

const defaultConfig: ChartTooltipConfig = {
  contentStyle: { 
    backgroundColor: '#18181B',
    border: '1px solid #374151',
    borderRadius: '0.375rem'
  },
  labelStyle: { color: '#E5E7EB' },
  itemStyle: { color: '#14B8A6' }
};

export function ChartTooltip({ config = defaultConfig }: { config?: ChartTooltipConfig }) {
  return (
    <Tooltip 
      contentStyle={config.contentStyle}
      labelStyle={config.labelStyle}
      itemStyle={config.itemStyle}
    />
  );
}