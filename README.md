# Menu Planner

An AI-powered weekly meal planning application built with React and TypeScript. Generate customized meal plans that meet your nutritional targets using GPT-4/GPT-5.

## Features

### 🎯 Nutritional Targeting
- Set daily calorie, protein, carbohydrate, and fat targets
- AI generates meals that align with your macronutrient goals
- View daily and weekly nutritional summaries

### 📅 Flexible Planning
- Choose which days of the week to plan for
- Select specific meals (breakfast, lunch, dinner) 
- Generate plans for weekdays only, full weeks, or custom combinations

### 🍽️ Personalized Preferences
- Specify cooking style preferences (Mediterranean, quick meals, etc.)
- Add dietary restrictions and food allergies
- Avoid meal repetition by providing previous week's menu

### 🌙 Modern UI/UX
- Dark mode by default with light mode option
- Responsive design for desktop and mobile
- Clean, modern interface with intuitive controls
- Accessible design with proper focus management

### 🔒 Secure API Integration
- Optional environment variable configuration for development
- Secure session-based API key storage
- Built-in API key management interface
- Ready for backend integration in production

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- OpenAI API key (get one at [platform.openai.com](https://platform.openai.com/api-keys))

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd menu-planner
```

2. Install frontend dependencies:
```bash
cd frontend
npm install
```

3. Install backend dependencies:
```bash
cd ../backend
npm install
```

4. Set up environment variables:

   **Backend (.env)**:
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env and add your OpenAI API key:
   OPENAI_API_KEY=sk-proj-your-openai-api-key-here
   ```
   
   **Frontend (.env.local)**:
   ```bash
   cd ../frontend
   # The .env.local should contain:
   VITE_API_BASE_URL=http://localhost:3002/api
   ```

5. Start the application:

   **Backend server**:
   ```bash
   cd backend
   npm start
   ```
   
   **Frontend development server**:
   ```bash
   cd frontend
   npm run dev
   ```

6. Open your browser to `http://localhost:5173`

### API Key Configuration

You can provide your OpenAI API key in two ways:

1. **Environment Variable** (recommended for development):
   - Copy `.env.example` to `.env.local`
   - Add your API key: `VITE_OPENAI_API_KEY=your_key_here`

2. **Through the App Interface**:
   - Click the settings (⚙️) button in the header
   - Enter your API key in the modal
   - Keys are stored securely in your browser session

## Usage

1. **Set Nutritional Targets**: Enter your daily calorie and macronutrient goals
2. **Choose Planning Options**: Select which days and meals to plan for
3. **Add Preferences**: Specify cooking styles, dietary restrictions, and foods to avoid
4. **Include Previous Menu**: Paste last week's meals to avoid repetition
5. **Generate Plan**: Click "Generate Weekly Menu" to create your personalized meal plan
6. **Review Results**: View your weekly plan in an organized table format

## Architecture

### Component Structure
```
menu-planner/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.tsx              # App header with theme toggle and settings
│   │   │   ├── MealPlanInput.tsx       # Input form for preferences and targets
│   │   │   ├── WeeklyMealPlan.tsx      # Weekly meal plan display table
│   │   │   └── ApiKeySettings.tsx      # API key configuration modal
│   │   ├── contexts/
│   │   │   └── ThemeContext.tsx        # Dark/light mode theme management
│   │   ├── services/
│   │   │   └── mealPlanService.ts      # Backend API integration
│   │   ├── types/
│   │   │   └── index.ts               # TypeScript type definitions
│   │   ├── App.tsx                    # Main application component
│   │   └── main.tsx                   # Application entry point
│   ├── prompts/
│   │   ├── meal-generation-prompt.txt  # AI system prompt
│   │   └── README.md                  # Prompt documentation
│   ├── package.json                   # Frontend dependencies
│   └── vite.config.ts                # Vite configuration
└── backend/
    ├── src/
    │   ├── routes/                    # API routes
    │   ├── services/                  # OpenAI integration
    │   ├── middleware/                # Security and validation
    │   └── server.js                  # Express server
    ├── package.json                   # Backend dependencies
    └── .env                          # Backend environment variables
```

### Key Technologies
- **React 18** with TypeScript
- **Vite** for fast development and building
- **CSS Custom Properties** for theming
- **OpenAI API** for meal plan generation
- **Modern ES6+** features throughout

## System Prompts

The application uses carefully crafted system prompts located in `src/prompts/` to ensure consistent, high-quality meal plan generation. See `src/prompts/README.md` for detailed documentation.

## Security Considerations

### Development
- API keys can be stored in environment variables
- Session storage provides temporary key storage in browser

### Production Recommendations
- Implement backend API proxy to handle OpenAI requests
- Never expose API keys in client-side code
- Use proper authentication and authorization
- Consider rate limiting and usage monitoring

## Contributing

1. Follow the existing code style and conventions
2. Add TypeScript types for new features
3. Update documentation for significant changes
4. Test thoroughly across different browsers and devices
5. Consider accessibility in all UI changes

## License

See LICENSE file for details.

## Future Enhancements

- [ ] Recipe detail generation with cooking instructions
- [ ] Shopping list generation from meal plans
- [ ] Meal plan templates and favorites
- [ ] Integration with nutrition tracking apps
- [ ] Ingredient substitution suggestions
- [ ] Meal prep time estimates
- [ ] Cost estimation for meal plans