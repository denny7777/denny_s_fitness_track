import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Icon from '../AppIcon';
import Button from './Button';
import { generateAIInsights } from '../../services/aiCoachService';

const AICoachPanel = ({ isOpen = true, onToggle }) => {
  const { user } = useAuth();
  const [insights, setInsights] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('insights');

  // Load real AI insights when user is available
  useEffect(() => {
    if (user?.id && isOpen) {
      loadInsights();
    }
  }, [user?.id, isOpen]);

  const loadInsights = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      const aiInsights = await generateAIInsights(user?.id);
      const formattedInsights = aiInsights?.map((insight, index) => ({
        id: index + 1,
        type: insight?.type,
        title: insight?.title,
        message: insight?.message,
        icon: insight?.icon,
        priority: insight?.priority,
        timestamp: new Date()?.toISOString()
      }));
      setInsights(formattedInsights);
    } catch (error) {
      console.error('Error loading AI insights:', error);
      // Enhanced fallback insights with error context
      setInsights([
        {
          id: 1,
          type: 'motivation',
          title: 'Stay Strong!',
          message: 'AI features are temporarily limited, but you\'re still crushing it!',
          icon: 'Zap',
          priority: 'medium',
          timestamp: new Date()?.toISOString()
        },
        {
          id: 2,
          type: 'recommendation',
          title: 'Keep Tracking',
          message: 'Continue logging your workouts and progress manually.',
          icon: 'Target',
          priority: 'high',
          timestamp: new Date()?.toISOString()
        },
        {
          id: 3,
          type: 'insight',
          title: 'Consistency Wins',
          message: 'Small daily actions lead to big long-term results.',
          icon: 'TrendingUp',
          priority: 'medium',
          timestamp: new Date()?.toISOString()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = [
    {
      label: 'Open AI Coach',
      icon: 'MessageCircle',
      action: () => window.location.href = '/ai-coach'
    },
    {
      label: 'Log Workout',
      icon: 'Plus',
      action: () => window.location.href = '/daily-check-in'
    },
    {
      label: 'View Goals',
      icon: 'Target',
      action: () => window.location.href = '/goals-list'
    },
    {
      label: 'Progress',
      icon: 'BarChart3',
      action: () => window.location.href = '/check-in-history'
    }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-emerald-600';
      case 'medium': return 'text-amber-600';
      case 'low': return 'text-slate-600';
      default: return 'text-muted-foreground';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'motivation': return 'Zap';
      case 'recommendation': return 'Lightbulb';
      case 'insight': return 'Brain';
      case 'warning': return 'AlertCircle';
      default: return 'MessageCircle';
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed right-4 top-20 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={onToggle}
          className="shadow-elevated bg-card"
        >
          <Icon name="Bot" size={20} />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed right-0 top-16 bottom-0 w-80 bg-card border-l border-border shadow-elevated z-50 lg:block hidden slide-in-right">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Bot" size={16} color="white" />
            </div>
            <h3 className="font-semibold text-foreground">AI Coach</h3>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
          >
            <Icon name="X" size={16} />
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border">
          <button
            onClick={() => setActiveTab('insights')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors duration-150 ${
              activeTab === 'insights' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Insights
          </button>
          <button
            onClick={() => setActiveTab('actions')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors duration-150 ${
              activeTab === 'actions' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Actions
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'insights' && (
            <div className="p-4 space-y-4">
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3]?.map((i) => (
                    <div key={i} className="h-20 bg-muted animate-pulse rounded-lg"></div>
                  ))}
                </div>
              ) : (
                <>
                  {insights?.map((insight) => (
                    <div
                      key={insight?.id}
                      className="p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors duration-150 cursor-pointer"
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg bg-background ${getPriorityColor(insight?.priority)}`}>
                          <Icon name={getTypeIcon(insight?.type)} size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-foreground text-sm mb-1">
                            {insight?.title}
                          </h4>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {insight?.message}
                          </p>
                          <div className="flex items-center mt-2 text-xs text-muted-foreground">
                            <Icon name="Clock" size={12} className="mr-1" />
                            <span>AI-generated</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {insights?.length === 0 && !isLoading && (
                    <div className="text-center p-4">
                      <Icon name="Brain" size={32} className="mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">No insights available yet.</p>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {activeTab === 'actions' && (
            <div className="p-4 space-y-3">
              {quickActions?.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  fullWidth
                  iconName={action?.icon}
                  iconPosition="left"
                  onClick={action?.action}
                  className="justify-start"
                >
                  {action?.label}
                </Button>
              ))}
              
              <div className="pt-4 mt-4 border-t border-border">
                <Button
                  variant="default"
                  fullWidth
                  iconName="MessageCircle"
                  iconPosition="left"
                  onClick={() => window.location.href = '/ai-coach'}
                  className="justify-center"
                >
                  Chat with AI Coach
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Powered by AI</span>
            <button 
              onClick={loadInsights}
              className="flex items-center space-x-1 hover:text-foreground transition-colors duration-150"
              disabled={isLoading}
            >
              <Icon name="RefreshCw" size={12} className={isLoading ? 'animate-spin' : ''} />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AICoachPanel;