import React from 'react';

interface Meal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface MealPlannerProps {
  meals: Meal[];
  onAddMeal: (meal: Meal) => void;
}

const MealPlanner: React.FC<MealPlannerProps> = ({ meals, onAddMeal }) => {
  const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);
  const totalProtein = meals.reduce((sum, meal) => sum + meal.protein, 0);
  const totalCarbs = meals.reduce((sum, meal) => sum + meal.carbs, 0);
  const totalFat = meals.reduce((sum, meal) => sum + meal.fat, 0);

  return (
    <div className="meal-planner">
      <h2>Daily Meal Plan</h2>
      
      <div className="nutrition-summary">
        <h3>Nutritional Summary</h3>
        <div className="nutrition-grid">
          <div className="nutrition-item">
            <span>Calories:</span>
            <span>{totalCalories}</span>
          </div>
          <div className="nutrition-item">
            <span>Protein:</span>
            <span>{totalProtein}g</span>
          </div>
          <div className="nutrition-item">
            <span>Carbs:</span>
            <span>{totalCarbs}g</span>
          </div>
          <div className="nutrition-item">
            <span>Fat:</span>
            <span>{totalFat}g</span>
          </div>
        </div>
      </div>

      <div className="meals-list">
        <h3>Planned Meals</h3>
        {meals.length === 0 ? (
          <p>No meals planned yet. Add some meals to get started!</p>
        ) : (
          <ul>
            {meals.map((meal) => (
              <li key={meal.id} className="meal-item">
                <h4>{meal.name}</h4>
                <div className="meal-nutrition">
                  <span>{meal.calories} cal</span>
                  <span>P: {meal.protein}g</span>
                  <span>C: {meal.carbs}g</span>
                  <span>F: {meal.fat}g</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <button 
        className="add-meal-btn"
        onClick={() => {
          // Placeholder for AI meal suggestion
          const sampleMeal: Meal = {
            id: Date.now().toString(),
            name: 'AI Suggested Meal',
            calories: 400,
            protein: 25,
            carbs: 45,
            fat: 12
          };
          onAddMeal(sampleMeal);
        }}
      >
        Get AI Meal Suggestion
      </button>
    </div>
  );
};

export default MealPlanner;
