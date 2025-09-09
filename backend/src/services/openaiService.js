// backend/src/services/openaiService.js
const { OpenAI } = require('openai');

class OpenAIService {
  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  async generateMealPlan(preferences) {
    const systemPrompt = `You are an expert nutritionist and meal-planning assistant. Your job is to generate a WEEKLY meal plan in strict JSON only (no markdown, no extra text). Observe the following rules exactly:

1) OUTPUT FORMAT: Return only a single JSON object. Do not emit any explanatory text outside the JSON. The JSON must include keys: "weekly_plan", "daily_totals", "shopping_list", and "notes". Each day under "weekly_plan" must include each requested meal type (e.g., "breakfast","lunch","dinner").

2) INGREDIENTS (MANDATORY): For every meal object include an "ingredients" array. Each array entry must be an object with exactly these keys:
   - "name" (string)
   - "quantity" (number)
   - "unit" (string) — use standard short units: g, kg, ml, l, tsp, tbsp, cup, piece
   - "optional" (boolean)

   Do NOT omit common supporting ingredients (oils, salt, pepper, butter, water), condiments, or garnishes. If an ingredient is normally present but assumed available in pantry, still list it and set "optional" appropriately.

3) QUANTITIES & SERVINGS: Use the user's nutrition/serving targets when available to estimate quantities; otherwise assume servings = 1. Be consistent — quantities must align with the nutrition totals provided.

4) AGGREGATE SHOPPING LIST: Include a top-level "shopping_list" array that aggregates total quantities across the whole week. Each shopping item must have "name","total_quantity","unit".

5) JSON VALIDITY: If you cannot produce valid JSON that meets the structure, return a JSON object with a single key "error" and a human-readable message. Do not return any other text.

6) DO NOT use markdown code fences, headers, or commentary. Use only valid JSON.

Example snippet (for format only — DO NOT include comments in output):
{
  "weekly_plan": { "monday": { "breakfast": {"name":"...","calories":0,"protein":0,"carbs":0,"fat":0,"ingredients":[{"name":"olive oil","quantity":10,"unit":"ml","optional":false}]}, "lunch": {...}, "dinner": {...} } },
  "daily_totals": {"monday":{"calories":0,"protein":0,"carbs":0,"fat":0}},
  "shopping_list": [{"name":"olive oil","total_quantity":210,"unit":"ml"}],
  "notes": "..."
}

Be strict and include all ingredients exactly as required.`;

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
      const response = await this.client.responses.create({
        model: 'gpt-5-mini',
        input: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_output_tokens: 3000,
        // keep reasoning effort if the model supports it; harmless otherwise
        reasoning: { effort: 'low' }
      });

      // Responses API may provide text in several places; try common locations
      let content = null;
      if (response.output_text) {
        content = response.output_text;
      } else if (Array.isArray(response.output) && response.output.length) {
        // The output array contains content objects; extract text fragments
        const pieces = [];
        response.output.forEach((item) => {
          if (Array.isArray(item.content)) {
            item.content.forEach((c) => {
              if (c.type === 'output_text' && c.text) pieces.push(c.text);
              else if (c.type === 'message' && c.text) pieces.push(c.text);
              else if (c.type === 'output_text' && c.text === undefined && c.parts) pieces.push(c.parts.join(''));
            });
          }
        });
        if (pieces.length) content = pieces.join('\n');
      }

      if (!content) {
        throw new Error('No content received from OpenAI Responses API');
      }

      // Clean the response - remove markdown code blocks if present
      let cleanedContent = content.trim();
      if (cleanedContent.startsWith('```json')) {
        cleanedContent = cleanedContent.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleanedContent.startsWith('```')) {
        cleanedContent = cleanedContent.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }

      // Parse the JSON response with robust fallbacks
      let mealPlan = null;
      try {
        mealPlan = JSON.parse(cleanedContent);
      } catch (parseErr) {
        console.error('Initial JSON.parse failed:', parseErr.message);
        // Try to extract the first {...} block from the response as a fallback
        const first = cleanedContent.indexOf('{');
        const last = cleanedContent.lastIndexOf('}');
        if (first !== -1 && last !== -1 && last > first) {
          const candidate = cleanedContent.slice(first, last + 1);
          try {
            mealPlan = JSON.parse(candidate);
          } catch (parseErr2) {
            console.error('Fallback substring JSON.parse failed:', parseErr2.message);
            // Attempt to repair with a focused follow-up to the model
            const followupPrompt = `The assistant returned malformed or incomplete JSON. Please return ONLY valid JSON that conforms exactly to the required schema (weekly_plan, daily_totals, shopping_list, notes). Here is the assistant output:\n\n${cleanedContent}\n\nReturn corrected JSON only.`;

            const repairResponse = await this.client.responses.create({
              model: 'gpt-5-mini',
              input: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: followupPrompt }
              ],
              max_output_tokens: 1200,
            });

            let repairText = repairResponse.output_text || '';
            if (!repairText && Array.isArray(repairResponse.output)) {
              const parts = [];
              repairResponse.output.forEach((item) => {
                if (Array.isArray(item.content)) item.content.forEach(c => { if (c.text) parts.push(c.text); });
              });
              repairText = parts.join('\n');
            }

            if (repairText) {
              let cleanedRepair = repairText.trim();
              if (cleanedRepair.startsWith('```json')) cleanedRepair = cleanedRepair.replace(/^```json\s*/, '').replace(/\s*```$/, '');
              else if (cleanedRepair.startsWith('```')) cleanedRepair = cleanedRepair.replace(/^```\s*/, '').replace(/\s*```$/, '');

              try {
                const repairedPlan = JSON.parse(cleanedRepair);
                const revalidation = this._validateMealPlan(repairedPlan, preferences);
                if (revalidation.valid) return repairedPlan;
                // if repairedPlan isn't valid, we'll fall through to throw below
              } catch (e) {
                console.error('Repaired JSON parse failed:', e.message);
              }
            }

            throw new Error(`Failed to parse JSON from model output: ${parseErr2.message || parseErr.message}`);
          }
        } else {
          // No obvious JSON block; attempt a repair request to the model
          const followupPrompt = `The assistant returned malformed or incomplete JSON. Please return ONLY valid JSON that conforms exactly to the required schema (weekly_plan, daily_totals, shopping_list, notes). Here is the assistant output:\n\n${cleanedContent}\n\nReturn corrected JSON only.`;

          const repairResponse = await this.client.responses.create({
            model: 'gpt-5-mini',
            input: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: followupPrompt }
            ],
            max_output_tokens: 1200,
          });

          let repairText = repairResponse.output_text || '';
          if (!repairText && Array.isArray(repairResponse.output)) {
            const parts = [];
            repairResponse.output.forEach((item) => {
              if (Array.isArray(item.content)) item.content.forEach(c => { if (c.text) parts.push(c.text); });
            });
            repairText = parts.join('\n');
          }

          if (repairText) {
            let cleanedRepair = repairText.trim();
            if (cleanedRepair.startsWith('```json')) cleanedRepair = cleanedRepair.replace(/^```json\s*/, '').replace(/\s*```$/, '');
            else if (cleanedRepair.startsWith('```')) cleanedRepair = cleanedRepair.replace(/^```\s*/, '').replace(/\s*```$/, '');

            try {
              const repairedPlan = JSON.parse(cleanedRepair);
              const revalidation = this._validateMealPlan(repairedPlan, preferences);
              if (revalidation.valid) return repairedPlan;
            } catch (e) {
              console.error('Repaired JSON parse failed (no block):', e.message);
            }
          }

          throw new Error(`Failed to parse JSON from model output: ${parseErr.message}`);
        }
      }

      // Validate the structure; if invalid, attempt one automatic repair request
      const validation = this._validateMealPlan(mealPlan, preferences);
      if (!validation.valid) {
        // Attempt a single follow-up to fix only the JSON structure
        const followupPrompt = `The JSON you returned is missing required fields or has invalid ingredient entries: ${JSON.stringify(validation.errors)}. Return only valid JSON that conforms exactly to the original schema. Do not add commentary.`;

        const repairResponse = await this.client.responses.create({
          model: 'gpt-5-mini',
          input: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: followupPrompt }
          ],
          max_output_tokens: 1200,
        });

        let repairText = repairResponse.output_text || '';
        if (!repairText && Array.isArray(repairResponse.output)) {
          const parts = [];
          repairResponse.output.forEach((item) => {
            if (Array.isArray(item.content)) item.content.forEach(c => { if (c.text) parts.push(c.text); });
          });
          repairText = parts.join('\n');
        }

        if (repairText) {
          let cleanedRepair = repairText.trim();
          if (cleanedRepair.startsWith('```json')) cleanedRepair = cleanedRepair.replace(/^```json\s*/, '').replace(/\s*```$/, '');
          else if (cleanedRepair.startsWith('```')) cleanedRepair = cleanedRepair.replace(/^```\s*/, '').replace(/\s*```$/, '');

          try {
            const repairedPlan = JSON.parse(cleanedRepair);
            const revalidation = this._validateMealPlan(repairedPlan, preferences);
            if (revalidation.valid) return repairedPlan;
          } catch (e) {
            // fall through to error below
          }
        }

        throw new Error(`AI returned invalid meal plan JSON: ${JSON.stringify(validation.errors)}`);
      }

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

// Helper validation method added to class prototype for clarity
OpenAIService.prototype._validateMealPlan = function(plan, preferences) {
  const errors = [];
  if (!plan || typeof plan !== 'object') {
    errors.push('plan is not an object');
    return { valid: false, errors };
  }

  if (!plan.weekly_plan || typeof plan.weekly_plan !== 'object') {
    errors.push('missing weekly_plan');
  }

  if (!plan.daily_totals || typeof plan.daily_totals !== 'object') {
    errors.push('missing daily_totals');
  }

  if (!Array.isArray(plan.shopping_list)) {
    errors.push('missing shopping_list array');
  }

  // Check each requested day and meal
  const days = preferences.selectedDays || [];
  const meals = preferences.selectedMeals || [];
  days.forEach(day => {
    const dayObj = plan.weekly_plan?.[day];
    if (!dayObj) {
      errors.push(`missing day: ${day}`);
      return;
    }
    meals.forEach(meal => {
      const mealObj = dayObj[meal];
      if (!mealObj) errors.push(`missing meal ${meal} for ${day}`);
      else {
        if (!Array.isArray(mealObj.ingredients)) errors.push(`ingredients missing or not array for ${day}.${meal}`);
        else {
          mealObj.ingredients.forEach((ing, i) => {
            if (!ing || typeof ing !== 'object') errors.push(`ingredient ${i} invalid for ${day}.${meal}`);
            else {
              if (!ing.name || typeof ing.name !== 'string') errors.push(`ingredient name missing for ${day}.${meal}`);
              if (typeof ing.quantity !== 'number') errors.push(`ingredient quantity missing or not number for ${day}.${meal}`);
              if (!ing.unit || typeof ing.unit !== 'string') errors.push(`ingredient unit missing for ${day}.${meal}`);
              if (typeof ing.optional !== 'boolean') errors.push(`ingredient optional flag missing or not boolean for ${day}.${meal}`);
            }
          });
        }
      }
    });
  });

  return { valid: errors.length === 0, errors };
};
