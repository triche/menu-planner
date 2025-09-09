import { UserPreferences, MealPlanResponse } from '../types';

// Backend API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

// Use backend proxy instead of direct OpenAI calls
export const generateMealPlan = async (preferences: UserPreferences): Promise<MealPlanResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/meal-plan/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ preferences }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      if (response.status === 429) {
        throw new Error(errorData.message || 'Rate limit exceeded. Please try again later.');
      } else if (response.status === 400) {
        throw new Error(errorData.message || 'Invalid request. Please check your inputs.');
      } else if (response.status >= 500) {
        throw new Error('Server error. Please try again later.');
      } else {
        throw new Error(errorData.message || `Request failed: ${response.status}`);
      }
    }

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to generate meal plan');
    }

    return result.data;
    
  } catch (error) {
    console.error('Error generating meal plan:', error);
    
    // Check if this is a network error (backend not available)
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.warn('Backend not available, falling back to demo mode');
      return generateDemoMealPlan(preferences);
    }
    
    throw error;
  }
};

// Fetch demo meal plan from backend (or use local fallback)
export const getDemoMealPlan = async (): Promise<MealPlanResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/meal-plan/demo`);
    
    if (response.ok) {
      const result = await response.json();
      return result.data;
    }
  } catch (error) {
    console.warn('Could not fetch demo from backend, using local demo');
  }
  
  // Fallback to local demo if backend is unavailable
  return generateLocalDemo();
};

// Local demo meal plan (fallback when backend is not available)
const generateLocalDemo = (): MealPlanResponse => {
  return {
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
      },
      tuesday: {
        breakfast: {
          name: "Oatmeal with Banana and Nuts",
          calories: 300,
          protein: 12,
          carbs: 50,
          fat: 10,
          ingredients: ["steel-cut oats", "banana", "walnuts", "cinnamon", "milk"]
        },
        lunch: {
          name: "Turkey and Avocado Wrap",
          calories: 380,
          protein: 28,
          carbs: 30,
          fat: 18,
          ingredients: ["whole wheat tortilla", "turkey breast", "avocado", "spinach", "tomato"]
        },
        dinner: {
          name: "Lean Beef Stir-fry with Brown Rice",
          calories: 480,
          protein: 35,
          carbs: 50,
          fat: 15,
          ingredients: ["lean beef", "brown rice", "mixed vegetables", "soy sauce", "ginger"]
        }
      }
    },
    daily_totals: {
      monday: { calories: 1220, protein: 95, carbs: 95, fat: 53 },
      tuesday: { calories: 1160, protein: 75, carbs: 130, fat: 43 }
    },
    notes: "Demo meal plan. Configure backend with OpenAI API key for personalized meal plans."
  };
};

// Legacy function for backward compatibility
const generateDemoMealPlan = (_preferences: UserPreferences): MealPlanResponse => {
  return generateLocalDemo();
};

// API key management (now handled by backend)
export const setUserApiKey = (_apiKey: string): void => {
  console.warn('API key management is now handled by the backend server.');
  // In a real application, this would involve user authentication
  // and storing the API key securely on the backend
};
