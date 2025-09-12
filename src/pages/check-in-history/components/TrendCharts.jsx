import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TrendCharts = ({ data }) => {
  const [activeChart, setActiveChart] = useState('mood');

  // Process data for charts
  const processChartData = () => {
    return data?.slice(-30)?.map(entry => ({
      date: new Date(entry.date)?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      mood: entry?.mood,
      energy: entry?.energyLevel,
      duration: entry?.duration,
      fullDate: entry?.date
    }));
  };

  const chartData = processChartData();

  // Calculate averages
  const averages = {
    mood: (data?.reduce((sum, entry) => sum + entry?.mood, 0) / data?.length)?.toFixed(1),
    energy: (data?.reduce((sum, entry) => sum + entry?.energyLevel, 0) / data?.length)?.toFixed(1),
    duration: Math.round(data?.reduce((sum, entry) => sum + entry?.duration, 0) / data?.length)
  };

  const chartConfigs = {
    mood: {
      title: 'Mood Trends',
      icon: 'Smile',
      color: '#2563EB',
      dataKey: 'mood',
      yAxisDomain: [1, 5],
      average: averages?.mood,
      unit: '/5'
    },
    energy: {
      title: 'Energy Levels',
      icon: 'Zap',
      color: '#10B981',
      dataKey: 'energy',
      yAxisDomain: [1, 10],
      average: averages?.energy,
      unit: '/10'
    },
    duration: {
      title: 'Workout Duration',
      icon: 'Clock',
      color: '#F59E0B',
      dataKey: 'duration',
      yAxisDomain: [0, 'dataMax'],
      average: averages?.duration,
      unit: ' min'
    }
  };

  const currentConfig = chartConfigs?.[activeChart];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      const data = payload?.[0];
      return (
        <div className="bg-popover text-popover-foreground p-3 rounded-lg shadow-elevated border border-border">
          <p className="font-medium">{label}</p>
          <p className="text-sm">
            <span style={{ color: data?.color }}>
              {currentConfig?.title}: {data?.value}{currentConfig?.unit}
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-soft mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Icon name="TrendingUp" size={24} className="text-primary" />
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Trend Analysis
            </h3>
            <p className="text-sm text-muted-foreground">
              Last 30 days overview
            </p>
          </div>
        </div>

        {/* Chart type selector */}
        <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
          {Object.entries(chartConfigs)?.map(([key, config]) => (
            <Button
              key={key}
              variant={activeChart === key ? "default" : "ghost"}
              size="sm"
              iconName={config?.icon}
              iconPosition="left"
              onClick={() => setActiveChart(key)}
              className="text-xs"
            >
              <span className="hidden sm:inline">{config?.title}</span>
            </Button>
          ))}
        </div>
      </div>
      {/* Statistics cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {Object.entries(chartConfigs)?.map(([key, config]) => (
          <div
            key={key}
            className={`p-4 rounded-lg border-2 transition-all duration-150 cursor-pointer hover-lift ${
              activeChart === key 
                ? 'border-primary bg-primary/5' :'border-border bg-muted/30 hover:border-muted-foreground/30'
            }`}
            onClick={() => setActiveChart(key)}
          >
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${activeChart === key ? 'bg-primary text-primary-foreground' : 'bg-background'}`}>
                <Icon 
                  name={config?.icon} 
                  size={20} 
                  className={activeChart === key ? '' : 'text-muted-foreground'}
                />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {config?.title}
                </p>
                <p className="text-lg font-bold text-foreground">
                  {config?.average}{config?.unit}
                </p>
                <p className="text-xs text-muted-foreground">
                  30-day average
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Chart */}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {activeChart === 'duration' ? (
            <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="date" 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <YAxis 
                domain={currentConfig?.yAxisDomain}
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey={currentConfig?.dataKey} 
                fill={currentConfig?.color}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          ) : (
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="date" 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <YAxis 
                domain={currentConfig?.yAxisDomain}
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey={currentConfig?.dataKey} 
                stroke={currentConfig?.color}
                strokeWidth={3}
                dot={{ fill: currentConfig?.color, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: currentConfig?.color, strokeWidth: 2 }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
      {/* Insights */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-muted/30 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="TrendingUp" size={16} className="text-success" />
              <span className="font-medium text-foreground text-sm">
                Pattern Recognition
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Your mood tends to be highest on weekends, with Tuesday showing the most consistent energy levels.
            </p>
          </div>
          
          <div className="bg-muted/30 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Target" size={16} className="text-primary" />
              <span className="font-medium text-foreground text-sm">
                Recommendation
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Consider scheduling more challenging workouts on high-energy days for optimal performance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendCharts;