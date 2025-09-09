import { useState } from 'react'
import './App.css'
import Header from './components/Header'
import MealPlanInput from './components/MealPlanInput'
import WeeklyMealPlan from './components/WeeklyMealPlan'
import ApiKeySettings from './components/ApiKeySettings'
import ProductionNotice from './components/ProductionNotice'
import { ThemeProvider } from './contexts/ThemeContext'
import { generateMealPlan } from './services/mealPlanService'
import { UserPreferences, NutritionInfo, MealPlanResponse } from './types'

function App() {
  const [nutritionTargets, setNutritionTargets] = useState<NutritionInfo>({
    calories: 2000,
    protein: 150,
    carbs: 250,
    fat: 65
  })
  
  const [mealPlan, setMealPlan] = useState<MealPlanResponse | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showApiSettings, setShowApiSettings] = useState(false)
  const [showProductionNotice, setShowProductionNotice] = useState(false)

  const handleGeneratePlan = async (preferences: UserPreferences) => {
    setIsGenerating(true)
    setError(null)
    
    try {
      const plan = await generateMealPlan(preferences)
      setMealPlan(plan)
      
      // Show info message if using demo mode
      if (plan.notes && plan.notes.includes('demo')) {
        setError('Demo mode: Configure your OpenAI API key in settings for personalized meal plans.')
      } else if (plan.notes && plan.notes.includes('CORS')) {
        setError('API connectivity issue detected. Using demo mode. Click for more info.')
        // Optionally show production notice
        // setShowProductionNotice(true)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate meal plan')
      console.error('Error generating meal plan:', err)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleUpdateTargets = (targets: NutritionInfo) => {
    setNutritionTargets(targets)
  }

  return (
    <ThemeProvider>
      <div className="App">
        <Header onOpenSettings={() => setShowApiSettings(true)} />
        
        <main className="App-main">
          {error && (
            <div className={`error-message ${error.includes('Demo mode') ? 'info-message' : ''}`}>
              <h3>{error.includes('Demo mode') ? 'Info' : 'Error'}</h3>
              <p>{error}</p>
              {(error.includes('API key') || error.includes('Demo mode')) && (
                <button onClick={() => setShowApiSettings(true)}>
                  Configure API Key
                </button>
              )}
              {error.includes('connectivity issue') && (
                <button onClick={() => setShowProductionNotice(true)}>
                  Learn More
                </button>
              )}
            </div>
          )}
          
          <div className="app-layout">
            <div className="input-section">
              <MealPlanInput
                onGeneratePlan={handleGeneratePlan}
                isGenerating={isGenerating}
                nutritionTargets={nutritionTargets}
                onUpdateTargets={handleUpdateTargets}
              />
            </div>
            
            <div className="plan-section">
              <WeeklyMealPlan mealPlan={mealPlan} />
            </div>
          </div>
        </main>
        
        <ApiKeySettings 
          isOpen={showApiSettings}
          onClose={() => setShowApiSettings(false)}
        />
        
        <ProductionNotice 
          isOpen={showProductionNotice}
          onClose={() => setShowProductionNotice(false)}
        />
      </div>
    </ThemeProvider>
  )
}

export default App
