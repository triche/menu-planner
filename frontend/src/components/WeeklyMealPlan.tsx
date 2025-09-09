import React from 'react';
import { MealPlanResponse, DayOfWeek, MealType } from '../types';

interface WeeklyMealPlanProps {
  mealPlan: MealPlanResponse | null;
}

const daysOfWeek: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const mealTypes: MealType[] = ['breakfast', 'lunch', 'dinner'];

const WeeklyMealPlan: React.FC<WeeklyMealPlanProps> = ({ mealPlan }) => {
  if (!mealPlan) {
    return (
      <div className="weekly-meal-plan">
        <h2>Weekly Meal Plan</h2>
        <div className="empty-plan">
          <p>Generate a meal plan to see your weekly menu here.</p>
        </div>
      </div>
    );
  }

  const { weekly_plan, daily_totals, notes } = mealPlan;

  const formatMealType = (mealType: string) => {
    return mealType.charAt(0).toUpperCase() + mealType.slice(1);
  };

  const formatDayName = (day: string) => {
    return day.charAt(0).toUpperCase() + day.slice(1);
  };

  return (
    <div className="weekly-meal-plan">
      <h2>Weekly Meal Plan</h2>
      
      {notes && (
        <div className="plan-notes">
          <h3>Notes</h3>
          <p>{notes}</p>
        </div>
      )}

      <div className="meal-plan-table">
        <div className="table-header">
          <div className="day-header">Day</div>
          {mealTypes.map(mealType => (
            <div key={mealType} className="meal-header">
              {formatMealType(mealType)}
            </div>
          ))}
          <div className="totals-header">Daily Totals</div>
        </div>

        {daysOfWeek.map(day => {
          const dayMeals = weekly_plan[day];
          const dayTotals = daily_totals[day];

          if (!dayMeals && !dayTotals) return null;

          return (
            <div key={day} className="table-row">
              <div className="day-cell">
                <strong>{formatDayName(day)}</strong>
              </div>
              
              {mealTypes.map(mealType => {
                const meal = dayMeals?.[mealType];
                return (
                  <div key={mealType} className="meal-cell">
                    {meal ? (
                      <div className="meal-info">
                        <h4>{meal.name}</h4>
                        <div className="meal-nutrition">
                          <span>{meal.calories} cal</span>
                          <span>P: {meal.protein}g</span>
                          <span>C: {meal.carbs}g</span>
                          <span>F: {meal.fat}g</span>
                        </div>
                        {meal.ingredients && meal.ingredients.length > 0 && (
                          <div className="ingredients">
                            <small>
                              {meal.ingredients.slice(0, 3).join(', ')}
                              {meal.ingredients.length > 3 && '...'}
                            </small>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="empty-meal">-</div>
                    )}
                  </div>
                );
              })}
              
              <div className="totals-cell">
                {dayTotals && (
                  <div className="daily-totals">
                    <div>{dayTotals.calories} cal</div>
                    <div>P: {dayTotals.protein}g</div>
                    <div>C: {dayTotals.carbs}g</div>
                    <div>F: {dayTotals.fat}g</div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="meal-plan-summary">
        <h3>Weekly Summary</h3>
        <div className="summary-stats">
          {Object.entries(daily_totals).map(([day, totals]) => (
            <div key={day} className="day-summary">
              <strong>{formatDayName(day)}:</strong>
              <span>{totals.calories} cal, P: {totals.protein}g, C: {totals.carbs}g, F: {totals.fat}g</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeeklyMealPlan;
