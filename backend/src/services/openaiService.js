// backend/src/services/openaiService.js
const { OpenAI } = require('openai');

class OpenAIService {
  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  async generateMealPlan(preferences) {
    const systemPrompt = `You are an expert nutritionist and meal planning assistant. Your task is to generate a weekly meal plan that meets specific nutritional targets and user preferences.

INSTRUCTIONS:
1. Create meals for the specified days and meal types (breakfast, lunch, dinner) as requested by the user
2. Ensure the total daily nutrition aligns with the user's macronutrient targets (calories, protein, carbs, fat)
3. Avoid repeating meals from the previous week's menu if provided
4. Consider any dietary restrictions, style preferences, or food omissions specified by the user
5. Provide varied, balanced, and practical meal suggestions
6. Include approximate nutritional information for each meal

OUTPUT FORMAT:
Return a JSON object with the following structure:
{
  "weekly_plan": {
    "monday": {
      "breakfast": {"name": "meal name", "calories": 000, "protein": 00, "carbs": 00, "fat": 00, "ingredients": ["ingredient1", "ingredient2"]},
      "lunch": {"name": "meal name", "calories": 000, "protein": 00, "carbs": 00, "fat": 00, "ingredients": ["ingredient1", "ingredient2"]},
      "dinner": {"name": "meal name", "calories": 000, "protein": 00, "carbs": 00, "fat": 00, "ingredients": ["ingredient1", "ingredient2"]}
    }
  },
  "daily_totals": {
    "monday": {"calories": 0000, "protein": 000, "carbs": 000, "fat": 000}
  },
  "notes": "Any additional notes about the meal plan"
}

Focus on creating realistic, achievable meals that a home cook can prepare.`;

    const userPrompt = `
NUTRITIONAL TARGETS:
- Calories: ${preferences.nutritionTargets.calories}
- Protein: ${preferences.nutritionTargets.protein}g
- Carbs: ${preferences.nutritionTargets.carbs}g
- Fat: ${preferences.nutritionTargets.fat}g

DAYS TO PLAN: ${preferences.selectedDays.join(', ')}
MEAL TYPES: ${preferences.selectedMeals.join(', ')}

STYLE PREFERENCES: ${preferences.stylePreferences || 'No specific preferences'}
DIETARY RESTRICTIONS: ${preferences.dietaryRestrictions || 'None specified'}

PREVIOUS WEEK'S MENU TO AVOID:
${preferences.previousWeekMenu || 'No previous menu provided'}

Please generate a meal plan that meets these requirements.`;

    try {
      const completion = await this.client.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 3000,
      });

      const content = completion.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No content received from OpenAI');
      }

      // Parse the JSON response
      const mealPlan = JSON.parse(content);
      return mealPlan;

    } catch (error) {
      console.error('OpenAI API Error:', error);
      
      if (error.code === 'rate_limit_exceeded') {
        throw new Error('Rate limit exceeded. Please try again later.');
      } else if (error.code === 'invalid_api_key') {
        throw new Error('Invalid API key configuration.');
      } else if (error.code === 'insufficient_quota') {
        throw new Error('Insufficient API quota. Please check your OpenAI billing.');
      } else {
        throw new Error(`AI service error: ${error.message}`);
      }
    }
  }
}

module.exports = new OpenAIService();
