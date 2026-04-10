# portfolio-front

## Project Description

Modern React-based frontend for the portfolio application. Features a dynamic dashboard, experience timeline, technology showcase, and certifications display.

## Tech Stack

- React 18
- Vite
- Redux Toolkit
- React Router DOM
- Tailwind CSS
- Framer Motion
- Supabase
- Apollo Client (GraphQL)
- Recharts

## Prerequisites

- Node.js 18+
- npm or yarn

## Installation & Run

1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Start development server:
```bash
npm start
```

## Environment Variables

Create a `.env` file with the following:

```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_OPENAI_API_KEY=your-openai-api-key
VITE_GEMINI_API_KEY=your-gemini-api-key
VITE_ANTHROPIC_API_KEY=your-anthropic-api-key
VITE_GOOGLE_ANALYTICS_ID=your-ga-id
VITE_ADSENSE_ID=your-adsense-id
VITE_PERPLEXITY_API_KEY=your-perplexity-key
VITE_STRIPE_PUBLISHABLE_KEY=your-stripe-key
```

## Related Repositories

- [portfolio-backend](https://github.com/stackvault-studio/portfolio-backend) - Backend API
- [portfolio-model](https://github.com/stackvault-studio/portfolio-model) - Shared models
- [portfolio](https://github.com/stackvault-studio/portfolio) - Central hub
