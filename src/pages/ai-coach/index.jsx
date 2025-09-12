import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/ui/Header';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Icon from '../../components/AppIcon';
import { getStreamingAICoachingResponse, generateAIInsights } from '../../services/aiCoachService';

const AICoach = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [insights, setInsights] = useState([]);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate('/landing-page');
    }
  }, [user, loading, navigate]);

  // Load AI insights on component mount
  useEffect(() => {
    if (user?.id) {
      loadAIInsights();
    }
  }, [user?.id]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef?.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef?.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef?.current?.scrollHeight + 'px';
    }
  }, [currentMessage]);

  const loadAIInsights = async () => {
    if (!user?.id) return;
    
    setIsLoadingInsights(true);
    try {
      const aiInsights = await generateAIInsights(user?.id);
      setInsights(aiInsights);
    } catch (error) {
      console.error('Error loading AI insights:', error);
      // Provide helpful fallback insights with error context
      setInsights([
        {
          type: 'motivation',
          title: 'AI Temporarily Limited',
          message: "Don't worry! You can still achieve your goals with determination.",
          priority: 'high',
          icon: 'Zap'
        },
        {
          type: 'recommendation',
          title: 'Manual Tracking',
          message: 'Continue tracking your progress using the regular features.',
          priority: 'medium',
          icon: 'Target'
        },
        {
          type: 'insight',
          title: 'Stay Consistent',
          message: 'Your consistency matters more than any AI advice.',
          priority: 'medium',
          icon: 'Heart'
        }
      ]);
    } finally {
      setIsLoadingInsights(false);
    }
  };

  const sendMessage = async () => {
    if (!currentMessage?.trim() || isLoading) return;

    const userMessage = currentMessage?.trim();
    setCurrentMessage('');
    
    // Add user message to chat
    const userMessageObj = {
      id: Date.now(),
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessageObj]);
    setIsLoading(true);

    // Prepare AI response message
    const aiMessageObj = {
      id: Date.now() + 1,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isStreaming: true
    };
    
    setMessages(prev => [...prev, aiMessageObj]);

    try {
      // Get conversation history (last 10 messages)
      const conversationHistory = messages?.slice(-10)?.map(msg => ({
        role: msg?.role,
        content: msg?.content
      }));

      await getStreamingAICoachingResponse(
        userMessage,
        user?.id,
        conversationHistory,
        (chunk) => {
          setMessages(prev => prev?.map(msg => 
            msg?.id === aiMessageObj?.id 
              ? { ...msg, content: msg?.content + chunk }
              : msg
          ));
        }
      );

      // Mark streaming as complete
      setMessages(prev => prev?.map(msg => 
        msg?.id === aiMessageObj?.id 
          ? { ...msg, isStreaming: false }
          : msg
      ));

    } catch (error) {
      console.error('Error sending message:', error);
      
      // Provide contextual error message based on error type
      let errorMessage = 'Sorry, I encountered an error. Please try again later.';
      if (error?.message?.includes('429') || error?.message?.includes('quota')) {
        errorMessage = "I'm experiencing high demand right now. While I work through this, remember that consistency with your workouts is key to success! Try asking me again in a few minutes.";
      } else if (error?.message?.includes('network') || error?.message?.includes('timeout')) {
        errorMessage = "I'm having trouble connecting right now. In the meantime, focus on your form, stay hydrated, and keep pushing toward your goals!";
      }
      
      setMessages(prev => prev?.map(msg => 
        msg?.id === aiMessageObj?.id 
          ? { 
              ...msg, 
              content: errorMessage,
              isStreaming: false 
            }
          : msg
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e?.key === 'Enter' && !e?.shiftKey) {
      e?.preventDefault();
      sendMessage();
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'medium': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'low': return 'text-slate-600 bg-slate-50 border-slate-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const startNewConversation = () => {
    setMessages([]);
    setCurrentMessage('');
  };

  const suggestedQuestions = [
    "How can I improve my current workout routine?",
    "I\'m feeling unmotivated lately. Any advice?",
    "What should I focus on to reach my goals faster?",
    "How can I maintain consistency in my fitness routine?"
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="text-muted-foreground">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-12rem)]">
          
          {/* Insights Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-card rounded-lg p-4 border shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground flex items-center space-x-2">
                  <Icon name="Brain" size={20} className="text-primary" />
                  <span>AI Insights</span>
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={loadAIInsights}
                  disabled={isLoadingInsights}
                >
                  <Icon name="RefreshCw" size={16} className={isLoadingInsights ? 'animate-spin' : ''} />
                </Button>
              </div>
              
              <div className="space-y-3">
                {isLoadingInsights ? (
                  <div className="space-y-2">
                    {[1, 2, 3]?.map(i => (
                      <div key={i} className="h-16 bg-muted animate-pulse rounded-md"></div>
                    ))}
                  </div>
                ) : (
                  insights?.map((insight, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-md border ${getPriorityColor(insight?.priority)}`}
                    >
                      <div className="flex items-start space-x-2">
                        <Icon name={insight?.icon} size={16} className="mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm mb-1">{insight?.title}</h4>
                          <p className="text-xs opacity-90 leading-relaxed">{insight?.message}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-card rounded-lg p-4 border shadow-sm">
              <h3 className="font-semibold text-foreground mb-3 flex items-center space-x-2">
                <Icon name="Zap" size={20} className="text-primary" />
                <span>Quick Actions</span>
              </h3>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  fullWidth
                  iconName="Target"
                  iconPosition="left"
                  onClick={() => navigate('/goals-list')}
                  className="justify-start text-xs"
                >
                  View Goals
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  fullWidth
                  iconName="Plus"
                  iconPosition="left"
                  onClick={() => navigate('/daily-check-in')}
                  className="justify-start text-xs"
                >
                  Log Workout
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  fullWidth
                  iconName="BarChart3"
                  iconPosition="left"
                  onClick={() => navigate('/check-in-history')}
                  className="justify-start text-xs"
                >
                  View Progress
                </Button>
              </div>
            </div>
          </div>

          {/* Main Chat Area */}
          <div className="lg:col-span-3 flex flex-col bg-card rounded-lg border shadow-sm">
            
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <Icon name="Bot" size={20} color="white" />
                </div>
                <div>
                  <h2 className="font-semibold text-foreground">AI Fitness Coach</h2>
                  <p className="text-sm text-muted-foreground">Your personal trainer powered by AI</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={startNewConversation}
                iconName="RotateCcw"
                iconPosition="left"
              >
                New Chat
              </Button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages?.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Icon name="MessageCircle" size={24} className="text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Welcome to your AI Fitness Coach!
                  </h3>
                  <p className="text-muted-foreground mb-6 max-w-md">
                    I'm here to help you with personalized fitness advice based on your goals and progress. 
                    Ask me anything about your workouts, nutrition, or motivation!
                  </p>
                  
                  {/* Suggested Questions */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-2xl">
                    {suggestedQuestions?.map((question, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentMessage(question)}
                        className="text-left p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors duration-150 text-sm border"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                messages?.map((message) => (
                  <div
                    key={message?.id}
                    className={`flex space-x-3 ${
                      message?.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {message?.role === 'assistant' && (
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                        <Icon name="Bot" size={16} color="white" />
                      </div>
                    )}
                    
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message?.role === 'user' ?'bg-primary text-primary-foreground ml-auto' :'bg-muted text-foreground'
                      }`}
                    >
                      <div className="prose prose-sm max-w-none">
                        {message?.content || (message?.isStreaming && '●●●')}
                      </div>
                      
                      {message?.isStreaming && (
                        <div className="flex items-center space-x-1 mt-2 text-xs opacity-60">
                          <div className="animate-pulse">AI is typing</div>
                          <div className="flex space-x-1">
                            <div className="w-1 h-1 bg-current rounded-full animate-bounce"></div>
                            <div className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {message?.role === 'user' && (
                      <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                        <Icon name="User" size={16} />
                      </div>
                    )}
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t">
              <div className="flex space-x-2">
                <div className="flex-1 relative">
                  <textarea
                    ref={textareaRef}
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e?.target?.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask your AI coach anything..."
                    className="w-full resize-none min-h-[44px] max-h-32 px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    rows="1"
                    disabled={isLoading}
                  />
                </div>
                <Button
                  onClick={sendMessage}
                  disabled={!currentMessage?.trim() || isLoading}
                  size="lg"
                  className="px-4"
                >
                  {isLoading ? (
                    <Icon name="Loader2" size={20} className="animate-spin" />
                  ) : (
                    <Icon name="Send" size={20} />
                  )}
                </Button>
              </div>
              
              <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                <div>Press Enter to send, Shift+Enter for new line</div>
                {currentMessage?.length > 0 && (
                  <div>{currentMessage?.length}/2000</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AICoach;