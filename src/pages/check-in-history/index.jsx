import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import AICoachPanel from '../../components/ui/AICoachPanel';
import QuickActionToolbar from '../../components/ui/QuickActionToolbar';
import FilterControls from './components/FilterControls';
import TrendCharts from './components/TrendCharts';
import StreakTracker from './components/StreakTracker';
import SummaryStats from './components/SummaryStats';
import TimelineEntry from './components/TimelineEntry';
import ExportControls from './components/ExportControls';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const CheckInHistory = () => {
  const [checkInData, setCheckInData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentFilters, setCurrentFilters] = useState({
    dateRange: 'all',
    moodFilter: 'all',
    goalFilter: 'all',
    searchQuery: ''
  });
  const [isAICoachOpen, setIsAICoachOpen] = useState(false);
  const [viewMode, setViewMode] = useState('timeline'); // timeline, stats, trends

  // Mock check-in data
  const mockCheckInData = [
    {
      id: 1,
      date: '2025-01-11',
      workoutType: 'Strength Training',
      duration: 45,
      mood: 4,
      energyLevel: 8,
      workoutSummary: 'Great upper body session focusing on chest and triceps. Increased weight on bench press by 5lbs.',
      fullDescription: `Today's workout was fantastic! Started with a 10-minute warm-up on the treadmill, then moved into my upper body routine.\n\nExercises completed:\n• Bench Press: 4 sets x 8 reps (increased to 185lbs)\n• Incline Dumbbell Press: 3 sets x 10 reps\n• Tricep Dips: 3 sets x 12 reps\n• Pull-ups: 3 sets x 8 reps\n• Overhead Press: 3 sets x 10 reps\n\nFeeling strong and motivated. The progressive overload is really paying off!`,
      goalUpdates: [
        {
          goalTitle: 'Bench Press 200lbs',previousValue: 180,newValue: 185,progress: 5,unit: 'lbs',
          targetValue: 200
        }
      ],
      aiRecommendations: 'Excellent progress on your bench press! Consider adding more tricep isolation work to support your pressing strength. Your form looked solid today.'
    },
    {
      id: 2,
      date: '2025-01-10',workoutType: 'Cardio',duration: 30,mood: 3,energyLevel: 6,workoutSummary: 'Moderate cardio session on the elliptical. Felt a bit sluggish but pushed through.',
      fullDescription: `Not my best day energy-wise, but consistency is key. Did a steady-state cardio session on the elliptical.\n\n• 30 minutes elliptical at moderate intensity\n• Average heart rate: 145 BPM\n• Calories burned: ~320\n• Distance: 3.2 miles\n\nSometimes you just need to show up and do the work, even when you don't feel like it.`,
      goalUpdates: [
        {
          goalTitle: 'Cardio 150 minutes/week',
          previousValue: 90,
          newValue: 120,
          progress: 30,
          unit: 'minutes',
          targetValue: 150
        }
      ],
      aiRecommendations: 'Good job pushing through on a low-energy day! Consider having a light snack 30 minutes before cardio to boost energy levels.'
    },
    {
      id: 3,
      date: '2025-01-09',
      workoutType: 'Yoga',
      duration: 60,
      mood: 5,
      energyLevel: 9,
      workoutSummary: 'Amazing yoga flow session. Felt incredibly centered and flexible afterwards.',
      fullDescription: `What a wonderful yoga session! Focused on hip openers and backbends today.\n\nSequence included:\n• Sun Salutation A & B (5 rounds each)\n• Warrior sequences\n• Pigeon pose variations\n• Camel pose\n• Wheel pose\n• Savasana (10 minutes)\n\nMy flexibility is definitely improving, and the mental clarity after yoga is unmatched.`,
      goalUpdates: [
        {
          goalTitle: 'Flexibility Training',
          previousValue: 8,
          newValue: 9,
          progress: 1,
          unit: 'sessions',
          targetValue: 20
        }
      ],
      aiRecommendations: 'Your yoga practice is really paying off! The combination of strength and flexibility work is excellent for overall fitness.'
    },
    {
      id: 4,
      date: '2025-01-08',
      workoutType: 'Strength Training',
      duration: 50,
      mood: 4,
      energyLevel: 7,
      workoutSummary: 'Leg day! Focused on squats and deadlifts. Legs are definitely feeling it.',
      fullDescription: `Leg day is always challenging but so rewarding. Focused on compound movements today.\n\n• Back Squats: 5 sets x 5 reps (worked up to 225lbs)\n• Romanian Deadlifts: 4 sets x 8 reps\n• Bulgarian Split Squats: 3 sets x 10 each leg\n• Leg Press: 3 sets x 15 reps\n• Calf Raises: 4 sets x 20 reps\n\nForm felt solid throughout. The mind-muscle connection is getting stronger.`,
      goalUpdates: [
        {
          goalTitle: 'Squat 250lbs',
          previousValue: 220,
          newValue: 225,
          progress: 5,
          unit: 'lbs',
          targetValue: 250
        }
      ],
      aiRecommendations: 'Strong squat session! Make sure to prioritize recovery with proper sleep and nutrition. Consider adding some mobility work for your hips.'
    },
    {
      id: 5,
      date: '2025-01-07',
      workoutType: 'HIIT',
      duration: 25,
      mood: 4,
      energyLevel: 8,
      workoutSummary: 'High-intensity interval training. Short but intense workout that left me energized.',
      fullDescription: `Quick but effective HIIT session today. Perfect for when time is limited.\n\nWorkout structure:\n• 5-minute warm-up\n• 4 rounds of:\n  - 30 seconds burpees\n  - 30 seconds mountain climbers\n  - 30 seconds jump squats\n  - 30 seconds rest\n• 5-minute cool-down\n\nHeart rate was definitely elevated! Love how efficient HIIT can be.`,
      goalUpdates: [],
      aiRecommendations: 'Great HIIT session! These short, intense workouts are excellent for cardiovascular fitness and time efficiency.'
    },
    {
      id: 6,
      date: '2025-01-06',
      workoutType: 'Swimming',
      duration: 40,
      mood: 5,
      energyLevel: 9,
      workoutSummary: 'Refreshing swim session. Love the full-body workout and the meditative aspect.',
      fullDescription: `Swimming is such a complete workout. Today focused on technique and endurance.\n\n• 400m warm-up (easy pace)\n• 8 x 50m freestyle (moderate effort)\n• 4 x 100m backstroke\n• 200m cool-down\n• Total distance: ~1200m\n\nThe water felt perfect today, and my stroke technique is improving.`,
      goalUpdates: [
        {
          goalTitle: 'Swim 2000m continuously',
          previousValue: 1000,
          newValue: 1200,
          progress: 200,
          unit: 'meters',
          targetValue: 2000
        }
      ],
      aiRecommendations: 'Excellent swimming progress! Your endurance is building nicely. Consider adding some drill work to further improve technique.'
    },
    {
      id: 7,
      date: '2025-01-05',
      workoutType: 'Rest Day',
      duration: 0,
      mood: 3,
      energyLevel: 5,
      workoutSummary: 'Active recovery day. Light stretching and walking.',
      fullDescription: `Sometimes rest is just as important as training. Today was about recovery.\n\n• 20-minute gentle walk in the park\n• 15 minutes of light stretching\n• Foam rolling session\n• Focused on hydration and nutrition\n\nListening to my body and giving it the rest it needs.`,
      goalUpdates: [],
      aiRecommendations: 'Smart choice taking a rest day. Recovery is when your body actually gets stronger. Keep prioritizing sleep and nutrition.'
    }
  ];

  // Mock streak data
  const mockStreakData = {
    currentStreak: 7,
    longestStreak: 14,
    recentDays: [
      { dayName: 'Mon', hasCheckIn: true },
      { dayName: 'Tue', hasCheckIn: true },
      { dayName: 'Wed', hasCheckIn: true },
      { dayName: 'Thu', hasCheckIn: true },
      { dayName: 'Fri', hasCheckIn: true },
      { dayName: 'Sat', hasCheckIn: true },
      { dayName: 'Sun', hasCheckIn: true }
    ]
  };

  useEffect(() => {
    // Simulate loading data
    setIsLoading(true);
    setTimeout(() => {
      setCheckInData(mockCheckInData);
      setFilteredData(mockCheckInData);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleFiltersChange = (filters) => {
    setCurrentFilters(filters);
    
    let filtered = [...checkInData];

    // Apply date range filter
    if (filters?.dateRange !== 'all') {
      const now = new Date();
      let startDate;
      
      switch (filters?.dateRange) {
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case '3months':
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = null;
      }
      
      if (startDate) {
        filtered = filtered?.filter(entry => new Date(entry.date) >= startDate);
      }
    }

    // Apply mood filter
    if (filters?.moodFilter !== 'all') {
      filtered = filtered?.filter(entry => entry?.mood === parseInt(filters?.moodFilter));
    }

    // Apply goal filter
    if (filters?.goalFilter !== 'all') {
      filtered = filtered?.filter(entry => {
        if (!entry?.goalUpdates || entry?.goalUpdates?.length === 0) return false;
        return entry?.goalUpdates?.some(goal => 
          goal?.goalTitle?.toLowerCase()?.includes(filters?.goalFilter?.replace('-', ' '))
        );
      });
    }

    // Apply search filter
    if (filters?.searchQuery) {
      const query = filters?.searchQuery?.toLowerCase();
      filtered = filtered?.filter(entry =>
        entry?.workoutSummary?.toLowerCase()?.includes(query) ||
        entry?.workoutType?.toLowerCase()?.includes(query) ||
        (entry?.fullDescription && entry?.fullDescription?.toLowerCase()?.includes(query))
      );
    }

    setFilteredData(filtered);
  };

  const handleExport = (format) => {
    console.log(`Exporting data in ${format} format`);
    // Export functionality would be implemented here
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="space-y-6">
              {[1, 2, 3, 4]?.map((i) => (
                <div key={i} className="skeleton h-32 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-16">
        <div className={`transition-all duration-300 ${isAICoachOpen ? 'mr-80' : 'mr-0'}`}>
          <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Page header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Check-in History
                </h1>
                <p className="text-muted-foreground">
                  Track your fitness journey and analyze your progress over time
                </p>
              </div>

              {/* View mode selector */}
              <div className="flex items-center space-x-2 bg-muted rounded-lg p-1">
                <Button
                  variant={viewMode === 'timeline' ? 'default' : 'ghost'}
                  size="sm"
                  iconName="List"
                  onClick={() => setViewMode('timeline')}
                >
                  Timeline
                </Button>
                <Button
                  variant={viewMode === 'stats' ? 'default' : 'ghost'}
                  size="sm"
                  iconName="BarChart3"
                  onClick={() => setViewMode('stats')}
                >
                  Stats
                </Button>
                <Button
                  variant={viewMode === 'trends' ? 'default' : 'ghost'}
                  size="sm"
                  iconName="TrendingUp"
                  onClick={() => setViewMode('trends')}
                >
                  Trends
                </Button>
              </div>
            </div>

            {/* Filter controls */}
            <FilterControls
              onFiltersChange={handleFiltersChange}
              totalEntries={filteredData?.length}
            />

            {/* Content based on view mode */}
            {viewMode === 'timeline' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main timeline */}
                <div className="lg:col-span-2">
                  {filteredData?.length === 0 ? (
                    <div className="bg-card border border-border rounded-lg p-12 text-center shadow-soft">
                      <Icon name="Calendar" size={48} className="text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        No check-ins found
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        {currentFilters?.searchQuery || currentFilters?.moodFilter !== 'all' || currentFilters?.goalFilter !== 'all' ?'Try adjusting your filters to see more results.' :'Start your fitness journey by logging your first workout!'}
                      </p>
                      <Button
                        variant="default"
                        iconName="Plus"
                        iconPosition="left"
                        onClick={() => window.location.href = '/daily-check-in'}
                      >
                        Log First Workout
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {filteredData?.map((entry, index) => (
                        <TimelineEntry
                          key={entry?.id}
                          entry={entry}
                          isLast={index === filteredData?.length - 1}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  <StreakTracker
                    currentStreak={mockStreakData?.currentStreak}
                    longestStreak={mockStreakData?.longestStreak}
                    recentDays={mockStreakData?.recentDays}
                  />
                  
                  <ExportControls
                    data={filteredData}
                    onExport={handleExport}
                  />
                </div>
              </div>
            )}

            {viewMode === 'stats' && (
              <div className="space-y-6">
                <SummaryStats data={filteredData} timeRange={currentFilters?.dateRange} />
                <StreakTracker
                  currentStreak={mockStreakData?.currentStreak}
                  longestStreak={mockStreakData?.longestStreak}
                  recentDays={mockStreakData?.recentDays}
                />
                <ExportControls
                  data={filteredData}
                  onExport={handleExport}
                />
              </div>
            )}

            {viewMode === 'trends' && (
              <div className="space-y-6">
                <TrendCharts data={filteredData} />
                <SummaryStats data={filteredData} timeRange={currentFilters?.dateRange} />
                <ExportControls
                  data={filteredData}
                  onExport={handleExport}
                />
              </div>
            )}

            {/* Quick action toolbar */}
            <QuickActionToolbar className="mt-8" />
          </div>
        </div>
      </div>
      {/* AI Coach Panel */}
      <AICoachPanel
        isOpen={isAICoachOpen}
        onToggle={() => setIsAICoachOpen(!isAICoachOpen)}
      />
    </div>
  );
};

export default CheckInHistory;