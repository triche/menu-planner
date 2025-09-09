export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface Meal {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: string[];
}

export interface DayMeals {
  breakfast?: Meal;
  lunch?: Meal;
  dinner?: Meal;
}

export interface WeeklyPlan {
  monday?: DayMeals;
  tuesday?: DayMeals;
  wednesday?: DayMeals;
  thursday?: DayMeals;
  friday?: DayMeals;
  saturday?: DayMeals;
  sunday?: DayMeals;
}

export interface MealPlanResponse {
  weekly_plan: WeeklyPlan;
  daily_totals: { [key: string]: NutritionInfo };
  notes?: string;
}

export interface UserPreferences {
  nutritionTargets: NutritionInfo;
  selectedDays: string[];
  selectedMeals: string[];
  stylePreferences: string;
  dietaryRestrictions: string;
  previousWeekMenu: string;
}

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
export type MealType = 'breakfast' | 'lunch' | 'dinner';

export interface Theme {
  isDark: boolean;
}
