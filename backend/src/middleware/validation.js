// backend/src/middleware/validation.js
const validateMealPlanRequest = (req, res, next) => {
  const { preferences } = req.body;

  if (!preferences) {
    return res.status(400).json({
      success: false,
      error: 'Validation error',
      message: 'Preferences object is required'
    });
  }

  // Validate nutritional targets
  const { nutritionTargets } = preferences;
  if (!nutritionTargets || 
      typeof nutritionTargets.calories !== 'number' ||
      typeof nutritionTargets.protein !== 'number' ||
      typeof nutritionTargets.carbs !== 'number' ||
      typeof nutritionTargets.fat !== 'number') {
    return res.status(400).json({
      success: false,
      error: 'Validation error',
      message: 'Valid nutrition targets are required'
    });
  }

  // Validate selected days
  const validDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  if (!Array.isArray(preferences.selectedDays) || 
      preferences.selectedDays.length === 0 ||
      !preferences.selectedDays.every(day => validDays.includes(day))) {
    return res.status(400).json({
      success: false,
      error: 'Validation error',
      message: 'Valid selected days are required'
    });
  }

  // Validate selected meals
  const validMeals = ['breakfast', 'lunch', 'dinner'];
  if (!Array.isArray(preferences.selectedMeals) || 
      preferences.selectedMeals.length === 0 ||
      !preferences.selectedMeals.every(meal => validMeals.includes(meal))) {
    return res.status(400).json({
      success: false,
      error: 'Validation error',
      message: 'Valid selected meals are required'
    });
  }

  // Validate string fields (optional but if provided, must be strings)
  if (preferences.stylePreferences && typeof preferences.stylePreferences !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Validation error',
      message: 'Style preferences must be a string'
    });
  }

  if (preferences.dietaryRestrictions && typeof preferences.dietaryRestrictions !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Validation error',
      message: 'Dietary restrictions must be a string'
    });
  }

  if (preferences.previousWeekMenu && typeof preferences.previousWeekMenu !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Validation error',
      message: 'Previous week menu must be a string'
    });
  }

  next();
};

module.exports = {
  validateMealPlanRequest
};
