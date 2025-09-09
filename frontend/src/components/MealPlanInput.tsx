import React, { useState } from 'react';
import { UserPreferences, NutritionInfo } from '../types';

interface MealPlanInputProps {
  onGeneratePlan: (preferences: UserPreferences) => void;
  isGenerating: boolean;
  nutritionTargets: NutritionInfo;
  onUpdateTargets: (targets: NutritionInfo) => void;
}

const daysOfWeek = [
  'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
];

const mealTypes = ['breakfast', 'lunch', 'dinner'];

const MealPlanInput: React.FC<MealPlanInputProps> = ({
  onGeneratePlan,
  isGenerating,
  nutritionTargets,
  onUpdateTargets
}) => {
  const [selectedDays, setSelectedDays] = useState<string[]>(['monday', 'tuesday', 'wednesday', 'thursday', 'friday']);
  const [selectedMeals, setSelectedMeals] = useState<string[]>(['lunch', 'dinner']);
  const [stylePreferences, setStylePreferences] = useState('');
  const [dietaryRestrictions, setDietaryRestrictions] = useState('');
  const [previousWeekMenu, setPreviousWeekMenu] = useState('');

  const handleDayToggle = (day: string) => {
    setSelectedDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  const handleMealToggle = (meal: string) => {
    setSelectedMeals(prev => 
      prev.includes(meal) 
        ? prev.filter(m => m !== meal)
        : [...prev, meal]
    );
  };

  const handleNutritionChange = (field: keyof NutritionInfo, value: string) => {
    const numValue = parseInt(value) || 0;
    onUpdateTargets({
      ...nutritionTargets,
      [field]: numValue
    });
  };

  const handleGenerateClick = () => {
    const preferences: UserPreferences = {
      nutritionTargets,
      selectedDays,
      selectedMeals,
      stylePreferences,
      dietaryRestrictions,
      previousWeekMenu
    };
    onGeneratePlan(preferences);
  };

  return (
    <div className="meal-plan-input">
      <div className="input-section">
        <h2>Nutrition Targets</h2>
        <div className="nutrition-inputs">
          <div className="input-group">
            <label>Daily Calories</label>
            <input
              type="number"
              value={nutritionTargets.calories}
              onChange={(e) => handleNutritionChange('calories', e.target.value)}
              min="0"
            />
          </div>
          <div className="input-group">
            <label>Protein (g)</label>
            <input
              type="number"
              value={nutritionTargets.protein}
              onChange={(e) => handleNutritionChange('protein', e.target.value)}
              min="0"
            />
          </div>
          <div className="input-group">
            <label>Carbs (g)</label>
            <input
              type="number"
              value={nutritionTargets.carbs}
              onChange={(e) => handleNutritionChange('carbs', e.target.value)}
              min="0"
            />
          </div>
          <div className="input-group">
            <label>Fat (g)</label>
            <input
              type="number"
              value={nutritionTargets.fat}
              onChange={(e) => handleNutritionChange('fat', e.target.value)}
              min="0"
            />
          </div>
        </div>
      </div>

      <div className="input-section">
        <h3>Days to Plan</h3>
        <div className="checkbox-group">
          {daysOfWeek.map(day => (
            <label key={day} className="checkbox-item">
              <input
                type="checkbox"
                checked={selectedDays.includes(day)}
                onChange={() => handleDayToggle(day)}
              />
              <span>{day.charAt(0).toUpperCase() + day.slice(1)}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="input-section">
        <h3>Meals to Include</h3>
        <div className="checkbox-group">
          {mealTypes.map(meal => (
            <label key={meal} className="checkbox-item">
              <input
                type="checkbox"
                checked={selectedMeals.includes(meal)}
                onChange={() => handleMealToggle(meal)}
              />
              <span>{meal.charAt(0).toUpperCase() + meal.slice(1)}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="input-section">
        <h3>Style Preferences</h3>
        <textarea
          value={stylePreferences}
          onChange={(e) => setStylePreferences(e.target.value)}
          placeholder="e.g., Mediterranean, quick meals, vegetarian, high-protein, comfort food..."
          rows={4}
        />
      </div>

      <div className="input-section">
        <h3>Dietary Restrictions</h3>
        <textarea
          value={dietaryRestrictions}
          onChange={(e) => setDietaryRestrictions(e.target.value)}
          placeholder="e.g., allergies, foods to avoid, specific dietary requirements..."
          rows={3}
        />
      </div>

      <div className="input-section">
        <h3>Previous Week's Menu</h3>
        <textarea
          value={previousWeekMenu}
          onChange={(e) => setPreviousWeekMenu(e.target.value)}
          placeholder="Paste your previous week's meals here to avoid repetition..."
          rows={5}
        />
      </div>

      <button 
        className="generate-button"
        onClick={handleGenerateClick}
        disabled={isGenerating || selectedDays.length === 0 || selectedMeals.length === 0}
      >
        {isGenerating ? 'Generating Menu...' : 'Generate Weekly Menu'}
      </button>
    </div>
  );
};

export default MealPlanInput;
