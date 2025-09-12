import React from 'react';
import Icon from '../../../components/AppIcon';

const SummaryStats = ({ data, timeRange = 'all' }) => {
  // Calculate statistics
  const calculateStats = () => {
    if (!data || data?.length === 0) {
      return {
        totalCheckIns: 0,
        averageMood: 0,
        averageEnergy: 0,
        totalWorkoutTime: 0,
        averageWorkoutTime: 0,
        checkInFrequency: 0,
        mostCommonWorkout: 'N/A',
        moodDistribution: {},
        energyTrend: 'stable'
      };
    }

    const totalCheckIns = data?.length;
    const averageMood = (data?.reduce((sum, entry) => sum + entry?.mood, 0) / totalCheckIns)?.toFixed(1);
    const averageEnergy = (data?.reduce((sum, entry) => sum + entry?.energyLevel, 0) / totalCheckIns)?.toFixed(1);
    const totalWorkoutTime = data?.reduce((sum, entry) => sum + entry?.duration, 0);
    const averageWorkoutTime = Math.round(totalWorkoutTime / totalCheckIns);

    // Calculate check-in frequency (assuming last 30 days for 'all')
    const daysInRange = timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 30;
    const checkInFrequency = Math.round((totalCheckIns / daysInRange) * 100);

    // Find most common workout type
    const workoutTypes = data?.reduce((acc, entry) => {
      acc[entry.workoutType] = (acc?.[entry?.workoutType] || 0) + 1;
      return acc;
    }, {});
    const mostCommonWorkout = Object.keys(workoutTypes)?.reduce((a, b) => 
      workoutTypes?.[a] > workoutTypes?.[b] ? a : b, 'N/A'
    );

    // Mood distribution
    const moodDistribution = data?.reduce((acc, entry) => {
      acc[entry.mood] = (acc?.[entry?.mood] || 0) + 1;
      return acc;
    }, {});

    // Energy trend (simplified)
    const recentEntries = data?.slice(-7);
    const olderEntries = data?.slice(-14, -7);
    const recentAvgEnergy = recentEntries?.reduce((sum, entry) => sum + entry?.energyLevel, 0) / recentEntries?.length;
    const olderAvgEnergy = olderEntries?.length > 0 
      ? olderEntries?.reduce((sum, entry) => sum + entry?.energyLevel, 0) / olderEntries?.length 
      : recentAvgEnergy;
    
    let energyTrend = 'stable';
    if (recentAvgEnergy > olderAvgEnergy + 0.5) energyTrend = 'increasing';
    else if (recentAvgEnergy < olderAvgEnergy - 0.5) energyTrend = 'decreasing';

    return {
      totalCheckIns,
      averageMood,
      averageEnergy,
      totalWorkoutTime,
      averageWorkoutTime,
      checkInFrequency,
      mostCommonWorkout,
      moodDistribution,
      energyTrend
    };
  };

  const stats = calculateStats();

  const statCards = [
    {
      title: 'Total Check-ins',
      value: stats?.totalCheckIns,
      icon: 'Calendar',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      suffix: ''
    },
    {
      title: 'Average Mood',
      value: stats?.averageMood,
      icon: 'Smile',
      color: 'text-success',
      bgColor: 'bg-success/10',
      suffix: '/5'
    },
    {
      title: 'Average Energy',
      value: stats?.averageEnergy,
      icon: 'Zap',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      suffix: '/10'
    },
    {
      title: 'Total Workout Time',
      value: Math.round(stats?.totalWorkoutTime / 60),
      icon: 'Clock',
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
      suffix: ' hrs'
    },
    {
      title: 'Avg Workout Duration',
      value: stats?.averageWorkoutTime,
      icon: 'Timer',
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      suffix: ' min'
    },
    {
      title: 'Consistency Rate',
      value: Math.min(stats?.checkInFrequency, 100),
      icon: 'Target',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      suffix: '%'
    }
  ];

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'increasing': return 'TrendingUp';
      case 'decreasing': return 'TrendingDown';
      default: return 'Minus';
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'increasing': return 'text-success';
      case 'decreasing': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-soft mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Icon name="BarChart3" size={24} className="text-primary" />
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Summary Statistics
            </h3>
            <p className="text-sm text-muted-foreground">
              {timeRange === 'week' ? 'Last 7 days' : 
               timeRange === 'month'? 'Last 30 days' : 'All time'} overview
            </p>
          </div>
        </div>
      </div>
      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {statCards?.map((stat, index) => (
          <div
            key={index}
            className="p-4 rounded-lg border border-border hover-lift transition-all duration-150 hover:shadow-soft"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg ${stat?.bgColor}`}>
                <Icon name={stat?.icon} size={20} className={stat?.color} />
              </div>
              {stat?.title === 'Average Energy' && (
                <div className="flex items-center space-x-1">
                  <Icon 
                    name={getTrendIcon(stats?.energyTrend)} 
                    size={16} 
                    className={getTrendColor(stats?.energyTrend)}
                  />
                </div>
              )}
            </div>
            
            <div>
              <p className="text-2xl font-bold text-foreground font-mono">
                {stat?.value}{stat?.suffix}
              </p>
              <p className="text-sm text-muted-foreground">
                {stat?.title}
              </p>
            </div>
          </div>
        ))}
      </div>
      {/* Additional insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Most common workout */}
        <div className="p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Activity" size={16} className="text-primary" />
            <span className="font-medium text-foreground text-sm">
              Most Common Workout
            </span>
          </div>
          <p className="text-lg font-semibold text-foreground">
            {stats?.mostCommonWorkout}
          </p>
          <p className="text-xs text-muted-foreground">
            Your go-to fitness activity
          </p>
        </div>

        {/* Mood breakdown */}
        <div className="p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center space-x-2 mb-3">
            <Icon name="PieChart" size={16} className="text-secondary" />
            <span className="font-medium text-foreground text-sm">
              Mood Distribution
            </span>
          </div>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5]?.map(mood => {
              const count = stats?.moodDistribution?.[mood] || 0;
              const percentage = stats?.totalCheckIns > 0 ? (count / stats?.totalCheckIns) * 100 : 0;
              return (
                <div
                  key={mood}
                  className="flex-1 bg-muted rounded-full overflow-hidden h-2"
                  title={`Mood ${mood}: ${count} times (${Math.round(percentage)}%)`}
                >
                  <div
                    className={`h-full transition-all duration-300 ${
                      mood === 5 ? 'bg-success' :
                      mood === 4 ? 'bg-primary' :
                      mood === 3 ? 'bg-warning' :
                      mood === 2 ? 'bg-accent' : 'bg-error'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              );
            })}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Hover bars to see mood breakdown
          </p>
        </div>
      </div>
      {/* Performance insights */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="bg-primary/10 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Lightbulb" size={16} className="text-primary" />
            <span className="font-medium text-foreground text-sm">
              Performance Insights
            </span>
          </div>
          <div className="space-y-1 text-xs text-muted-foreground">
            <p>
              • Your consistency rate is {stats?.checkInFrequency}% - 
              {stats?.checkInFrequency >= 80 ? ' Excellent!' : 
               stats?.checkInFrequency >= 60 ? ' Good progress!': ' Room for improvement!'}
            </p>
            <p>
              • Energy levels are {stats?.energyTrend} - 
              {stats?.energyTrend === 'increasing' ? ' Keep up the great work!' :
               stats?.energyTrend === 'decreasing'? ' Consider adjusting your routine.' : ' Maintaining steady performance.'}
            </p>
            <p>
              • Average mood of {stats?.averageMood}/5 indicates 
              {parseFloat(stats?.averageMood) >= 4 ? ' excellent' : 
               parseFloat(stats?.averageMood) >= 3 ? ' good' : ' moderate'} well-being.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryStats;