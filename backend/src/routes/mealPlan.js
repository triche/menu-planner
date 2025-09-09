// backend/src/routes/mealPlan.js
const express = require('express');
const router = express.Router();
const openaiService = require('../services/openaiService');
const { validateMealPlanRequest } = require('../middleware/validation');
const { rateLimitStrict } = require('../middleware/rateLimiter');

// Apply strict rate limiting to AI endpoints
router.use(rateLimitStrict);

// Generate meal plan endpoint
router.post('/generate', validateMealPlanRequest, async (req, res) => {
  try {
    const { preferences } = req.body;
    
    // Log request for monitoring (remove sensitive data)
    console.log('Meal plan request:', {
      selectedDays: preferences.selectedDays,
      selectedMeals: preferences.selectedMeals,
      timestamp: new Date().toISOString()
    });

    const mealPlan = await openaiService.generateMealPlan(preferences);
    
    res.json({
      success: true,
      data: mealPlan,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error generating meal plan:', error);
    
    // Return appropriate error response
    if (error.message.includes('Rate limit')) {
      res.status(429).json({
        success: false,
        error: 'Rate limit exceeded',
        message: error.message,
        retryAfter: 60
      });
    } else if (error.message.includes('API key')) {
      res.status(500).json({
        success: false,
        error: 'Configuration error',
        message: 'Service temporarily unavailable'
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Generation failed',
        message: error.message
      });
    }
  }
});

// Get demo meal plan endpoint
router.get('/demo', (req, res) => {
  const demoMealPlan = {
    weekly_plan: {
      monday: {
        breakfast: {
          name: "Greek Yogurt with Berries and Granola",
          calories: 280,
          protein: 20,
          carbs: 35,
          fat: 8,
          ingredients: ["Greek yogurt", "mixed berries", "honey", "granola", "almonds"]
        },
        lunch: {
          name: "Grilled Chicken Caesar Salad",
          calories: 420,
          protein: 35,
          carbs: 15,
          fat: 25,
          ingredients: ["chicken breast", "romaine lettuce", "parmesan", "olive oil", "croutons"]
        },
        dinner: {
          name: "Baked Salmon with Quinoa and Vegetables",
          calories: 520,
          protein: 40,
          carbs: 45,
          fat: 20,
          ingredients: ["salmon fillet", "quinoa", "broccoli", "bell peppers", "lemon"]
        }
      }
    },
    daily_totals: {
      monday: { calories: 1220, protein: 95, carbs: 95, fat: 53 }
    },
    notes: "This is a demo meal plan served from the backend."
  };

  res.json({
    success: true,
    data: demoMealPlan,
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
