# Weather Pro 🌤️

A professional-level weather application built with Next.js 15, TypeScript, and Tailwind CSS.
# weather app URL
https://weather-app-munza.netlify.app/
## Features

✨ **Beautiful UI** - Modern glassmorphism design with dynamic weather-based gradients
🌍 **Global Coverage** - Search for any city worldwide
📍 **Location Detection** - Auto-detect user's current location
📊 **Current Weather** - Real-time weather data with detailed metrics
⏰ **Hourly Forecast** - 24-hour weather prediction
📅 **7-Day Forecast** - Weekly weather outlook
🌓 **Theme Toggle** - Dark/Light mode support
📱 **Responsive Design** - Works perfectly on all devices

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **API:** OpenWeatherMap
- **HTTP Client:** Axios

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Get an API Key**
   - Sign up at [OpenWeatherMap](https://openweathermap.org/api)
   - Get your free API key

2. **Configure Environment**
   ```bash
   # Edit .env.local and add your API key
   NEXT_PUBLIC_OPENWEATHER_API_KEY=your_actual_api_key
   ```

3. **Install Dependencies**
   ```bash
   npm install
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

5. **Open Browser**
   - Navigate to `http://localhost:3000`

## Project Structure

```
src/
├── app/                  # Next.js App Router
│   ├── globals.css      # Global styles
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Home page
├── components/          # React components
│   ├── CitySearch.tsx   # City search component
│   ├── CurrentWeather.tsx
│   ├── DailyForecast.tsx
│   ├── HourlyForecast.tsx
│   ├── ThemeToggle.tsx
│   └── WeatherDashboard.tsx
├── lib/                 # Utilities
│   ├── utils.ts        # Helper functions
│   └── weather.ts      # Weather API & formatters
└── types/              # TypeScript types
    └── weather.ts      # Weather data types
```

## API Endpoints Used

- **Current Weather:** `/weather`
- **5-Day Forecast:** `/forecast`
- **Geocoding:** `/geo/1.0/direct`

## Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project to [Vercel](https://vercel.com)
3. Add environment variable `NEXT_PUBLIC_OPENWEATHER_API_KEY`
4. Deploy!

### Other Platforms

```bash
npm run build
npm run start
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_OPENWEATHER_API_KEY` | OpenWeatherMap API key | Yes |

## Features Breakdown

### Search Functionality
- Real-time city search with autocomplete
- Support for city name, state, and country
- Display of search results with location details

### Weather Display
- Current temperature with "feels like"
- High/Low temperatures
- Weather condition with animated icons
- Humidity, wind speed, pressure, cloud coverage
- Sunrise and sunset times

### Forecasts
- Hourly forecast for next 24 hours
- 7-day daily forecast
- Precipitation probability
- Weather icons for each period

### UI/UX
- Dynamic background gradients based on weather
- Smooth animations and transitions
- Glassmorphism card designs
- Responsive layout for mobile, tablet, desktop
- Dark/light theme toggle

## License

MIT License - feel free to use this project for learning or production.

## Acknowledgments

- Weather data provided by [OpenWeatherMap](https://openweathermap.org/)
- Icons from [Lucide React](https://lucide.dev/)
- UI components with [Tailwind CSS](https://tailwindcss.com/)
