import React from 'react';

const WeeklyOverview = ({ weeklyData }) => {
  const getDayAbbreviation = (date) => {
    return new Date(date)?.toLocaleDateString('en-US', { weekday: 'short' });
  };

  const getCompletionColor = (completed) => {
    if (completed >= 100) return 'bg-success';
    if (completed >= 75) return 'bg-primary';
    if (completed >= 50) return 'bg-warning';
    if (completed > 0) return 'bg-error';
    return 'bg-muted';
  };

  const getCompletionHeight = (completed) => {
    return Math.max(4, (completed / 100) * 32);
  };

  // Generate default weekly data if none provided or invalid
  const generateDefaultWeeklyData = () => {
    const data = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date?.setDate(today?.getDate() - i);
      data?.push({
        date: date?.toISOString()?.split('T')?.[0],
        completion: 0
      });
    }
    return data;
  };

  // Ensure weeklyData is an array and has valid structure
  const validWeeklyData = Array.isArray(weeklyData) && weeklyData?.length > 0 
    ? weeklyData 
    : generateDefaultWeeklyData();

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Weekly Overview</h3>
          <p className="text-sm text-muted-foreground">
            Goal completion by day
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-success rounded-full"></div>
            <span className="text-xs text-muted-foreground">Complete</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-warning rounded-full"></div>
            <span className="text-xs text-muted-foreground">Partial</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-muted rounded-full"></div>
            <span className="text-xs text-muted-foreground">None</span>
          </div>
        </div>
      </div>
      <div className="flex items-end justify-between space-x-2 h-40">
        {validWeeklyData?.map((day, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div className="flex-1 flex items-end mb-2">
              <div
                className={`w-full rounded-t transition-all duration-300 ${getCompletionColor(day?.completion || 0)}`}
                style={{ height: `${getCompletionHeight(day?.completion || 0)}px` }}
              />
            </div>
            <div className="text-center">
              <p className="text-xs font-medium text-foreground">
                {getDayAbbreviation(day?.date)}
              </p>
              <p className="text-xs text-muted-foreground">
                {day?.completion || 0}%
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-border">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-lg font-bold text-foreground font-mono">
              {validWeeklyData?.filter(day => (day?.completion || 0) === 100)?.length || 0}
            </p>
            <p className="text-xs text-muted-foreground">Days Complete</p>
          </div>
          <div>
            <p className="text-lg font-bold text-foreground font-mono">
              {validWeeklyData?.length > 0 
                ? Math.round(validWeeklyData?.reduce((acc, day) => acc + (day?.completion || 0), 0) / validWeeklyData?.length)
                : 0}%
            </p>
            <p className="text-xs text-muted-foreground">Avg Completion</p>
          </div>
          <div>
            <p className="text-lg font-bold text-foreground font-mono">
              {validWeeklyData?.filter(day => (day?.completion || 0) > 0)?.length || 0}
            </p>
            <p className="text-xs text-muted-foreground">Active Days</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyOverview;