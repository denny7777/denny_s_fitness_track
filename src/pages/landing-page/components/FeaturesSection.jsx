import React from 'react';
import Icon from '../../../components/AppIcon';

const FeaturesSection = () => {
  const features = [
    {
      id: 1,
      icon: 'Calendar',
      title: 'Daily Check-ins',
      description: 'Track your workouts, mood, and energy levels with quick daily check-ins that take less than 2 minutes.',
      color: 'primary',
      stats: '2 min avg'
    },
    {
      id: 2,
      icon: 'BarChart3',
      title: 'Progress Visualization',
      description: 'See your fitness journey unfold with beautiful charts, streak counters, and achievement milestones.',
      color: 'secondary',
      stats: '15+ charts'
    },
    {
      id: 3,
      icon: 'Brain',
      title: 'AI Recommendations',
      description: 'Get personalized coaching tips and workout suggestions based on your progress patterns and goals.',
      color: 'success',
      stats: 'Smart insights'
    },
    {
      id: 4,
      icon: 'Target',
      title: 'Goal Management',
      description: 'Set SMART fitness goals with target dates, track progress, and celebrate achievements along the way.',
      color: 'warning',
      stats: 'Unlimited goals'
    },
    {
      id: 5,
      icon: 'Smartphone',
      title: 'Mobile Optimized',
      description: 'Access your fitness data anywhere with our responsive design that works perfectly on all devices.',
      color: 'error',
      stats: 'Any device'
    },
    {
      id: 6,
      icon: 'Shield',
      title: 'Secure & Private',
      description: 'Your fitness data is encrypted and secure. We never share your personal information with third parties.',
      color: 'primary',
      stats: 'Bank-level security'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      primary: 'bg-primary text-primary-foreground',
      secondary: 'bg-secondary text-secondary-foreground',
      success: 'bg-success text-success-foreground',
      warning: 'bg-warning text-warning-foreground',
      error: 'bg-error text-error-foreground'
    };
    return colors?.[color] || colors?.primary;
  };

  return (
    <section className="py-20 lg:py-32 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-primary/10 px-4 py-2 rounded-full mb-6">
            <Icon name="Sparkles" size={16} className="text-primary" />
            <span className="text-sm font-medium text-primary">Features</span>
          </div>
          
          <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-6">
            Everything You Need to
            <span className="text-primary block">Succeed</span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our comprehensive fitness tracking platform combines goal setting, progress monitoring, 
            and AI-powered insights to help you achieve lasting results.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features?.map((feature) => (
            <div
              key={feature?.id}
              className="bg-card rounded-xl p-8 border border-border shadow-soft hover-lift hover:shadow-elevated transition-all duration-300 group"
            >
              <div className="flex items-center justify-between mb-6">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getColorClasses(feature?.color)}`}>
                  <Icon name={feature?.icon} size={24} />
                </div>
                <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-full">
                  {feature?.stats}
                </span>
              </div>

              <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                {feature?.title}
              </h3>

              <p className="text-muted-foreground leading-relaxed">
                {feature?.description}
              </p>

              {/* Hover Effect Arrow */}
              <div className="flex items-center mt-6 text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-sm font-medium mr-2">Learn more</span>
                <Icon name="ArrowRight" size={16} />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-card rounded-2xl p-8 border border-border shadow-soft">
            <div className="flex items-center justify-center mb-4">
              <div className="flex -space-x-2">
                <div className="w-10 h-10 bg-primary rounded-full border-2 border-card flex items-center justify-center">
                  <Icon name="User" size={16} color="white" />
                </div>
                <div className="w-10 h-10 bg-secondary rounded-full border-2 border-card flex items-center justify-center">
                  <Icon name="User" size={16} color="white" />
                </div>
                <div className="w-10 h-10 bg-success rounded-full border-2 border-card flex items-center justify-center">
                  <Icon name="User" size={16} color="white" />
                </div>
                <div className="w-10 h-10 bg-warning rounded-full border-2 border-card flex items-center justify-center text-foreground font-bold text-sm">
                  +10K
                </div>
              </div>
            </div>
            
            <h3 className="text-2xl font-bold text-foreground mb-2">
              Join 10,000+ Fitness Enthusiasts
            </h3>
            
            <p className="text-muted-foreground mb-6">
              Start tracking your fitness goals today and see the difference structured progress makes.
            </p>

            <div className="flex items-center justify-center space-x-8 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Icon name="CheckCircle" size={16} className="text-success" />
                <span>Free to start</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Clock" size={16} className="text-primary" />
                <span>2-minute setup</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Smartphone" size={16} className="text-secondary" />
                <span>Works everywhere</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;