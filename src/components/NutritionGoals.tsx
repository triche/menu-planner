import React from 'react';

interface NutritionTargets {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface NutritionGoalsProps {
  targets: NutritionTargets;
  onUpdateTargets: (targets: NutritionTargets) => void;
}

const NutritionGoals: React.FC<NutritionGoalsProps> = ({ targets, onUpdateTargets }) => {
  const handleInputChange = (field: keyof NutritionTargets, value: string) => {
    const numValue = parseInt(value) || 0;
    onUpdateTargets({
      ...targets,
      [field]: numValue
    });
  };

  return (
    <div className="nutrition-goals">
      <h2>Nutrition Goals</h2>
      <div className="goals-grid">
        <div className="goal-item">
          <label htmlFor="calories">Daily Calories:</label>
          <input
            id="calories"
            type="number"
            value={targets.calories}
            onChange={(e) => handleInputChange('calories', e.target.value)}
            min="0"
          />
        </div>
        <div className="goal-item">
          <label htmlFor="protein">Protein (g):</label>
          <input
            id="protein"
            type="number"
            value={targets.protein}
            onChange={(e) => handleInputChange('protein', e.target.value)}
            min="0"
          />
        </div>
        <div className="goal-item">
          <label htmlFor="carbs">Carbs (g):</label>
          <input
            id="carbs"
            type="number"
            value={targets.carbs}
            onChange={(e) => handleInputChange('carbs', e.target.value)}
            min="0"
          />
        </div>
        <div className="goal-item">
          <label htmlFor="fat">Fat (g):</label>
          <input
            id="fat"
            type="number"
            value={targets.fat}
            onChange={(e) => handleInputChange('fat', e.target.value)}
            min="0"
          />
        </div>
      </div>
    </div>
  );
};

export default NutritionGoals;
