import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const HeroSection = ({ onSignUp, onSignIn }) => {
  return (
    <section className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20 lg:py-32 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-20 h-20 bg-primary rounded-full"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-secondary rounded-full"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-success rounded-full"></div>
        <div className="absolute bottom-40 right-1/3 w-24 h-24 bg-warning rounded-full"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start mb-6">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mr-4">
                <Icon name="Dumbbell" size={24} color="white" />
              </div>
              <span className="text-2xl font-bold text-foreground">
                Denny's Fitness Track
              </span>
            </div>

            <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Transform Your
              <span className="text-primary block">Fitness Journey</span>
            </h1>

            <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-2xl">
              Set meaningful goals, track daily progress, and get AI-powered coaching recommendations. 
              Your personal fitness companion for sustainable results.
            </p>

            {/* Key Benefits */}
            <div className="flex flex-wrap gap-4 mb-8 justify-center lg:justify-start">
              <div className="flex items-center space-x-2 bg-card px-4 py-2 rounded-full border border-border">
                <Icon name="Target" size={16} className="text-primary" />
                <span className="text-sm font-medium text-foreground">Goal Tracking</span>
              </div>
              <div className="flex items-center space-x-2 bg-card px-4 py-2 rounded-full border border-border">
                <Icon name="Brain" size={16} className="text-secondary" />
                <span className="text-sm font-medium text-foreground">AI Coaching</span>
              </div>
              <div className="flex items-center space-x-2 bg-card px-4 py-2 rounded-full border border-border">
                <Icon name="TrendingUp" size={16} className="text-success" />
                <span className="text-sm font-medium text-foreground">Progress Insights</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                variant="default"
                size="lg"
                iconName="UserPlus"
                iconPosition="left"
                onClick={onSignUp}
                className="text-lg px-8 py-4"
              >
                Start Your Journey
              </Button>
              <Button
                variant="outline"
                size="lg"
                iconName="LogIn"
                iconPosition="left"
                onClick={onSignIn}
                className="text-lg px-8 py-4"
              >
                Sign In
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center justify-center lg:justify-start mt-8 space-x-6 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Icon name="Shield" size={16} className="text-success" />
                <span>SSL Secured</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Users" size={16} className="text-primary" />
                <span>10,000+ Users</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Star" size={16} className="text-warning" />
                <span>4.9/5 Rating</span>
              </div>
            </div>
          </div>

          {/* Visual Element */}
          <div className="relative">
            <div className="bg-card rounded-2xl p-8 shadow-elevated border border-border">
              {/* Mock Dashboard Preview */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-foreground">Today's Progress</h3>
                  <div className="flex items-center space-x-1">
                    <Icon name="Flame" size={20} className="text-success" />
                    <span className="font-bold text-foreground">7</span>
                  </div>
                </div>

                {/* Mock Progress Bars */}
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-foreground">Workout Goal</span>
                      <span className="text-muted-foreground">75%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full w-3/4"></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-foreground">Steps Today</span>
                      <span className="text-muted-foreground">8,500/10,000</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-secondary h-2 rounded-full w-4/5"></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-foreground">Water Intake</span>
                      <span className="text-muted-foreground">6/8 glasses</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-success h-2 rounded-full w-3/4"></div>
                    </div>
                  </div>
                </div>

                {/* Mock AI Suggestion */}
                <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon name="Bot" size={16} color="white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground mb-1">AI Coach Tip</p>
                      <p className="text-xs text-muted-foreground">
                        Great progress today! Consider adding 10 minutes of stretching to optimize recovery.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-success rounded-full flex items-center justify-center shadow-elevated">
              <Icon name="Trophy" size={24} color="white" />
            </div>
            <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-warning rounded-full flex items-center justify-center shadow-elevated">
              <Icon name="Zap" size={20} color="white" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;