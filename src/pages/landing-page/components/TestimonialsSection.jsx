import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const TestimonialsSection = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Marathon Runner',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      content: `The AI coaching feature is incredible! It noticed my workout patterns and suggested the perfect rest days. I've improved my marathon time by 15 minutes in just 3 months.`,rating: 5,achievement: 'Lost 25 lbs'
    },
    {
      id: 2,
      name: 'Mike Rodriguez',role: 'Fitness Enthusiast',avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',content: `Finally, a fitness app that actually helps me stick to my goals! The daily check-ins keep me accountable, and seeing my progress visualized motivates me every day.`,rating: 5,achievement: '50-day streak'
    },
    {
      id: 3,
      name: 'Emily Chen',role: 'Busy Professional',avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      content: `As someone with a hectic schedule, the quick 2-minute check-ins are perfect. The app adapts to my lifestyle and gives me realistic goals I can actually achieve.`,
      rating: 5,
      achievement: 'Gained 10 lbs muscle'
    },
    {
      id: 4,
      name: 'David Thompson',role: 'Personal Trainer',avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      content: `I recommend this app to all my clients. The goal tracking is comprehensive, and the progress visualization helps them see results even when the scale doesn't move.`,
      rating: 5,
      achievement: 'Trainer approved'
    },
    {
      id: 5,
      name: 'Lisa Park',
      role: 'Yoga Instructor',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
      content: `The holistic approach to fitness tracking is what sets this apart. It tracks not just workouts but mood and energy levels too. Perfect for mind-body wellness.`,
      rating: 5,
      achievement: 'Improved flexibility'
    },
    {
      id: 6,
      name: 'James Wilson',
      role: 'Weight Loss Journey',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      content: `Lost 40 pounds using this app! The AI suggestions kept me motivated when I hit plateaus, and the community aspect made me feel supported throughout my journey.`,
      rating: 5,
      achievement: 'Lost 40 lbs'
    }
  ];

  const renderStars = (rating) => {
    return [...Array(5)]?.map((_, i) => (
      <Icon
        key={i}
        name="Star"
        size={16}
        className={i < rating ? 'text-warning fill-current' : 'text-muted'}
      />
    ));
  };

  return (
    <section className="py-20 lg:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-success/10 px-4 py-2 rounded-full mb-6">
            <Icon name="MessageCircle" size={16} className="text-success" />
            <span className="text-sm font-medium text-success">Testimonials</span>
          </div>
          
          <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-6">
            Real Results from
            <span className="text-success block">Real People</span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Join thousands of users who have transformed their fitness journey with our platform. 
            Here's what they have to say about their experience.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {testimonials?.map((testimonial) => (
            <div
              key={testimonial?.id}
              className="bg-card rounded-xl p-6 border border-border shadow-soft hover-lift hover:shadow-elevated transition-all duration-300"
            >
              {/* Rating */}
              <div className="flex items-center space-x-1 mb-4">
                {renderStars(testimonial?.rating)}
              </div>

              {/* Content */}
              <blockquote className="text-muted-foreground mb-6 leading-relaxed">
                "{testimonial?.content}"
              </blockquote>

              {/* User Info */}
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Image
                    src={testimonial?.avatar}
                    alt={testimonial?.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-success rounded-full border-2 border-card flex items-center justify-center">
                    <Icon name="Check" size={10} color="white" />
                  </div>
                </div>
                
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground">
                    {testimonial?.name}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {testimonial?.role}
                  </p>
                </div>

                <div className="text-right">
                  <div className="bg-success/10 px-2 py-1 rounded-full">
                    <span className="text-xs font-medium text-success">
                      {testimonial?.achievement}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="bg-card rounded-2xl p-8 border border-border shadow-soft">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Users" size={24} className="text-primary" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-2">10,000+</div>
              <div className="text-sm text-muted-foreground">Active Users</div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Target" size={24} className="text-success" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-2">50,000+</div>
              <div className="text-sm text-muted-foreground">Goals Achieved</div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Calendar" size={24} className="text-warning" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-2">1M+</div>
              <div className="text-sm text-muted-foreground">Check-ins Logged</div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Star" size={24} className="text-secondary" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-2">4.9/5</div>
              <div className="text-sm text-muted-foreground">User Rating</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;