# System Prompts

This directory contains system prompts used by the Menu Planner application for AI-powered meal generation.

## Files

### meal-generation-prompt.txt

**Purpose**: Primary system prompt for GPT-4/GPT-5 to generate weekly meal plans

**Usage**: This prompt is loaded by the `mealPlanService.ts` and sent to the OpenAI API along with user preferences to generate customized meal plans.

**Key Features**:
- Instructs the AI to act as a nutritionist and meal planning expert
- Defines input format (nutritional targets, preferences, restrictions)
- Specifies JSON output format for structured meal plan data
- Emphasizes practical, varied, and nutritionally balanced meal suggestions
- Includes guidance to avoid repeating meals from previous weeks

**Input Parameters**:
- Nutritional targets (calories, protein, carbs, fat)
- Days to plan for
- Meal types (breakfast, lunch, dinner)
- Style preferences and dietary restrictions
- Previous week's menu for avoiding repetition

**Output Format**:
Returns a structured JSON object containing:
- `weekly_plan`: Nested object with days and meals
- `daily_totals`: Nutritional summaries for each day
- `notes`: Additional guidance or comments

## Usage in Code

The prompts are loaded dynamically in `src/services/mealPlanService.ts`:

```typescript
const systemPromptResponse = await fetch('/src/prompts/meal-generation-prompt.txt');
const systemPrompt = await systemPromptResponse.text();
```

## Best Practices

1. **Prompt Engineering**: These prompts are carefully crafted to produce consistent, useful results
2. **Versioning**: Consider versioning prompts if making significant changes
3. **Testing**: Test prompt changes with various input scenarios
4. **Documentation**: Keep this README updated when adding new prompts or modifying existing ones

## Future Enhancements

Potential additional prompt files:
- `recipe-detail-prompt.txt` - For generating detailed cooking instructions
- `dietary-substitution-prompt.txt` - For suggesting ingredient substitutions
- `shopping-list-prompt.txt` - For generating grocery shopping lists
