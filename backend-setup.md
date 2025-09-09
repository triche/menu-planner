# Backend Server for Menu Planner

## Quick Setup

```bash
mkdir menu-planner-backend
cd menu-planner-backend
npm init -y
npm install express cors dotenv openai helmet express-rate-limit
npm install -D @types/node @types/express typescript ts-node nodemon
```

## File Structure
```
backend/
├── src/
│   ├── routes/
│   │   └── mealPlan.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── rateLimiter.js
│   ├── services/
│   │   └── openaiService.js
│   └── server.js
├── .env
├── package.json
└── README.md
```
