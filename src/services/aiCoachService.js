import openai from '../lib/openaiClient';
import { supabase } from '../lib/supabase';

/**
 * Fetches comprehensive user data for AI coaching context
 * @param {string} userId - User ID
 * @returns {Promise<Object>} User data including goals, check-ins, and progress
 */
export async function getUserDataForCoaching(userId) {
  try {
    const [
      { data: userProfile },
      { data: goals },
      { data: recentCheckIns },
      { data: progressUpdates }
    ] = await Promise.all([
      supabase?.from('user_profiles')?.select('*')?.eq('id', userId)?.single(),
      
      supabase?.from('fitness_goals')?.select('*')?.eq('user_id', userId)?.eq('status', 'active')?.order('created_at', { ascending: false }),
      
      supabase?.from('daily_check_ins')?.select('*')?.eq('user_id', userId)?.order('date', { ascending: false })?.limit(7),
      
      supabase?.from('goal_progress_updates')?.select(`
          *,
          fitness_goals(title, goal_type, unit, target_value, current_value)
        `)?.eq('user_id', userId)?.order('created_at', { ascending: false })?.limit(10)
    ]);

    return {
      userProfile,
      goals: goals || [],
      recentCheckIns: recentCheckIns || [],
      progressUpdates: progressUpdates || []
    };
  } catch (error) {
    console.error('Error fetching user data for coaching:', error);
    throw error;
  }
}

/**
 * Generates a comprehensive coaching context from user data
 * @param {Object} userData - User data object
 * @returns {string} Formatted context string
 */
export function generateCoachingContext(userData) {
  const { userProfile, goals, recentCheckIns, progressUpdates } = userData;

  let context = `User Profile: ${userProfile?.full_name || 'Unknown User'}\n\n`;

  // Add active goals
  if (goals?.length > 0) {
    context += "Active Fitness Goals:\n";
    goals?.forEach(goal => {
      const progress = goal?.current_value && goal?.target_value 
        ? ((goal?.current_value / goal?.target_value) * 100)?.toFixed(1)
        : 0;
      
      context += `- ${goal?.title} (${goal?.goal_type}): ${goal?.current_value || 0}/${goal?.target_value} ${goal?.unit} (${progress}% complete)\n`;
      context += `  Target Date: ${goal?.target_date}\n`;
      context += `  Description: ${goal?.description || 'No description'}\n\n`;
    });
  }

  // Add recent check-ins
  if (recentCheckIns?.length > 0) {
    context += "Recent Daily Check-ins (Last 7 days):\n";
    recentCheckIns?.forEach(checkin => {
      context += `- ${checkin?.date}: Mood: ${checkin?.mood}, Energy: ${checkin?.energy_level}/10\n`;
      if (checkin?.workout_completed) {
        context += `  Workout: ${checkin?.workout_summary || 'Completed'}\n`;
      }
      if (checkin?.notes) {
        context += `  Notes: ${checkin?.notes}\n`;
      }
    });
    context += "\n";
  }

  // Add recent progress updates
  if (progressUpdates?.length > 0) {
    context += "Recent Progress Updates:\n";
    progressUpdates?.forEach(update => {
      const goal = update?.fitness_goals;
      if (goal) {
        context += `- ${goal?.title}: Improved from ${update?.previous_value} to ${update?.new_value} ${goal?.unit}\n`;
        if (update?.notes) {
          context += `  Notes: ${update?.notes}\n`;
        }
      }
    });
  }

  return context;
}

/**
 * Check if OpenAI API is available and has quota
 * @returns {Promise<boolean>} Whether API is available
 */
async function checkOpenAIAvailability() {
  try {
    if (!import.meta.env?.VITE_OPENAI_API_KEY) {
      return false;
    }

    // Simple test call to check API availability
    const response = await openai?.chat?.completions?.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: 'test' }],
      max_tokens: 1
    });
    
    return true;
  } catch (error) {
    console.warn('OpenAI API not available:', error?.message);
    return false;
  }
}

/**
 * Generates AI coaching response with user context
 * @param {string} userMessage - User's message
 * @param {string} userId - User ID
 * @param {Array} conversationHistory - Previous conversation messages
 * @returns {Promise<string>} AI response
 */
export async function getAICoachingResponse(userMessage, userId, conversationHistory = []) {
  try {
    // Check API availability first
    const isAPIAvailable = await checkOpenAIAvailability();
    if (!isAPIAvailable) {
      return getFallbackResponse(userMessage, userId);
    }

    const userData = await getUserDataForCoaching(userId);
    let context = generateCoachingContext(userData);

    const systemPrompt = `You are an experienced fitness coach and wellness expert. You have access to the user's fitness data and should provide personalized, encouraging, and actionable advice.

User Context:
${context}

Guidelines for responses:
- Be encouraging and supportive
- Reference specific user data when relevant
- Provide actionable fitness and wellness advice
- Be concise but thorough
- Focus on gradual, sustainable progress
- Address both physical and mental aspects of fitness
- Celebrate achievements and provide motivation for challenges
- Ask follow-up questions to better understand user needs

Remember to be personal and reference their actual goals, progress, and recent activities when providing advice.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
      { role: 'user', content: userMessage }
    ];

    const response = await openai?.chat?.completions?.create({
      model: 'gpt-4o-mini', // Using a more affordable model
      messages: messages,
      max_tokens: 500,
      temperature: 0.7
    });

    return response?.choices?.[0]?.message?.content;
  } catch (error) {
    console.error('Error getting AI coaching response:', error);
    
    // Handle specific error types
    if (error?.message?.includes('429') || error?.message?.includes('quota')) {
      return "I'm currently experiencing high demand. Here's some general advice: Stay consistent with your workouts, focus on proper form, and remember that progress takes time. Keep up the great work!";
    }
    
    return getFallbackResponse(userMessage, userId);
  }
}

/**
 * Streams AI coaching response with user context
 * @param {string} userMessage - User's message
 * @param {string} userId - User ID
 * @param {Array} conversationHistory - Previous conversation messages
 * @param {Function} onChunk - Callback for streamed chunks
 */
export async function getStreamingAICoachingResponse(userMessage, userId, conversationHistory = [], onChunk) {
  try {
    // Check API availability first
    const isAPIAvailable = await checkOpenAIAvailability();
    if (!isAPIAvailable) {
      const fallbackResponse = getFallbackResponse(userMessage, userId);
      // Simulate streaming for fallback response
      const words = fallbackResponse?.split(' ');
      for (let i = 0; i < words?.length; i++) {
        setTimeout(() => {
          onChunk(words?.[i] + ' ');
        }, i * 50);
      }
      return;
    }

    const userData = await getUserDataForCoaching(userId);
    let context = generateCoachingContext(userData);

    const systemPrompt = `You are an experienced fitness coach and wellness expert. You have access to the user's fitness data and should provide personalized, encouraging, and actionable advice.

User Context:
${context}

Guidelines for responses:
- Be encouraging and supportive
- Reference specific user data when relevant
- Provide actionable fitness and wellness advice
- Be concise but thorough
- Focus on gradual, sustainable progress
- Address both physical and mental aspects of fitness
- Celebrate achievements and provide motivation for challenges
- Ask follow-up questions to better understand user needs

Remember to be personal and reference their actual goals, progress, and recent activities when providing advice.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
      { role: 'user', content: userMessage }
    ];

    const stream = await openai?.chat?.completions?.create({
      model: 'gpt-4o-mini', // Using a more affordable model
      messages: messages,
      stream: true,
      max_tokens: 500,
      temperature: 0.7
    });

    for await (const chunk of stream) {
      const content = chunk?.choices?.[0]?.delta?.content || '';
      if (content) {
        onChunk(content);
      }
    }
  } catch (error) {
    console.error('Error getting streaming AI coaching response:', error);
    
    // Stream fallback response
    const fallbackMessage = error?.message?.includes('429') || error?.message?.includes('quota')
      ? "I'm currently experiencing high demand. Here's some general advice: Stay consistent with your workouts, focus on proper form, and remember that progress takes time. Keep up the great work!"
      : getFallbackResponse(userMessage, userId);
    
    const words = fallbackMessage?.split(' ');
    for (let i = 0; i < words?.length; i++) {
      setTimeout(() => {
        onChunk(words?.[i] + ' ');
      }, i * 50);
    }
  }
}

/**
 * Generates AI insights based on user data
 * @param {string} userId - User ID
 * @returns {Promise<Array>} Array of AI-generated insights
 */
export async function generateAIInsights(userId) {
  try {
    // Check API availability first
    const isAPIAvailable = await checkOpenAIAvailability();
    if (!isAPIAvailable) {
      return getFallbackInsights(userId);
    }

    const userData = await getUserDataForCoaching(userId);
    let context = generateCoachingContext(userData);

    const insightsPrompt = `Based on this user's fitness data, generate 3-4 personalized insights and recommendations. Each insight should be actionable and specific to their situation.

User Context:
${context}

Please provide insights as a JSON array with this format:
[
  {
    "type": "motivation",
    "title": "Keep Going!",
    "message": "You're making great progress on your fitness journey.",
    "priority": "medium",
    "icon": "Zap"
  }
]

Valid types: motivation, recommendation, insight, warning
Valid priorities: high, medium, low
Valid icons: TrendingUp, Heart, Brain, AlertCircle, Target, Zap, Lightbulb`;

    const response = await openai?.chat?.completions?.create({
      model: 'gpt-4o-mini', // Using a more affordable model
      messages: [
        { role: 'system', content: 'You are a fitness coach providing personalized insights. Respond only with valid JSON array.' },
        { role: 'user', content: insightsPrompt }
      ],
      max_tokens: 400,
      temperature: 0.7
    });

    const result = JSON.parse(response?.choices?.[0]?.message?.content);
    return Array.isArray(result) ? result : [result];
  } catch (error) {
    console.error('Error generating AI insights:', error);
    return getFallbackInsights(userId);
  }
}

/**
 * Generate fallback response when AI is not available
 * @param {string} userMessage - User's message
 * @param {string} userId - User ID
 * @returns {string} Fallback response
 */
function getFallbackResponse(userMessage, userId) {
  const lowerMessage = userMessage?.toLowerCase() || '';
  
  if (lowerMessage?.includes('motivat')) {
    return "Every step forward counts! Remember, consistency beats perfection. You're building healthy habits that will serve you for life. Keep pushing forward - you've got this!";
  }
  
  if (lowerMessage?.includes('workout') || lowerMessage?.includes('exercise')) {
    return "Great question about workouts! Focus on proper form over speed, listen to your body, and make sure to include both cardio and strength training. Progressive overload is key - gradually increase intensity as you get stronger.";
  }
  
  if (lowerMessage?.includes('diet') || lowerMessage?.includes('nutrition')) {
    return "Nutrition is crucial for your fitness goals! Focus on whole foods, adequate protein, and staying hydrated. Remember, it's about creating sustainable habits rather than perfection. Small changes add up to big results.";
  }
  
  if (lowerMessage?.includes('goal')) {
    return "Your goals are achievable with the right approach! Break them down into smaller, manageable milestones. Celebrate your progress along the way, and remember that setbacks are part of the journey. Stay focused and consistent!";
  }
  
  return "I'm here to help with your fitness journey! While my AI features are temporarily limited, I encourage you to stay consistent with your workouts and nutrition. Remember, progress takes time, and you're on the right path!";
}

/**
 * Generate fallback insights when AI is not available
 * @param {string} userId - User ID
 * @returns {Array} Fallback insights
 */
async function getFallbackInsights(userId) {
  try {
    // Try to get some basic data to provide relevant fallback insights
    const userData = await getUserDataForCoaching(userId);
    const { goals, recentCheckIns } = userData;
    
    const insights = [];
    
    // Check if user has active goals
    if (goals?.length > 0) {
      insights?.push({
        type: 'motivation',
        title: 'Goals in Progress',
        message: `You have ${goals?.length} active goal${goals?.length > 1 ? 's' : ''}. Keep pushing forward!`,
        priority: 'high',
        icon: 'Target'
      });
    } else {
      insights?.push({
        type: 'recommendation',
        title: 'Set Your Goals',
        message: 'Setting clear fitness goals helps track progress and stay motivated.',
        priority: 'high',
        icon: 'Target'
      });
    }
    
    // Check recent check-ins
    if (recentCheckIns?.length > 0) {
      const recentCheckIn = recentCheckIns?.[0];
      if (recentCheckIn?.energy_level >= 7) {
        insights?.push({
          type: 'insight',
          title: 'High Energy Levels',
          message: 'Your energy levels are great! Perfect time for challenging workouts.',
          priority: 'medium',
          icon: 'Zap'
        });
      }
    }
    
    // Add general motivational insights
    insights?.push({
      type: 'motivation',
      title: 'Stay Consistent',
      message: 'Consistency is key to achieving your fitness goals. Every workout counts!',
      priority: 'medium',
      icon: 'Heart'
    });
    
    insights?.push({
      type: 'recommendation',
      title: 'Track Your Progress',
      message: 'Regular check-ins help you stay accountable and see improvements.',
      priority: 'low',
      icon: 'TrendingUp'
    });
    
    return insights?.slice(0, 4); // Return max 4 insights
  } catch (error) {
    console.error('Error generating fallback insights:', error);
    
    // Return basic fallback insights if everything fails
    return [
      {
        type: 'motivation',
        title: 'Keep Going!',
        message: 'You\'re making great progress on your fitness journey.',
        priority: 'medium',
        icon: 'Zap'
      },
      {
        type: 'recommendation',
        title: 'Stay Hydrated',
        message: 'Don\'t forget to drink plenty of water throughout the day.',
        priority: 'low',
        icon: 'Heart'
      },
      {
        type: 'insight',
        title: 'Rest is Important',
        message: 'Make sure to get adequate sleep for optimal recovery.',
        priority: 'medium',
        icon: 'Brain'
      }
    ];
  }
}