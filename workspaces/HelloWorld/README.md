# HelloWorldWeather

A simple weather application that leverages AI-powered weather insights through the OpenWeather API. Ask any weather-related question and get intelligent responses about weather conditions around the world.

## Features

- 🌤️ **Real-time Weather Data** - Get current weather information for any location
- 🤖 **AI Weather Assistant** - Ask natural language questions about weather conditions
- 🏙️ **City Selection** - Choose from popular cities or enter custom locations
- 🌍 **Global Coverage** - Weather data for locations worldwide
- 📱 **Web-based Interface** - Runs directly in your browser
- 🔍 **Smart City Lookup** - Validates and finds cities automatically

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- OpenWeather API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/helloworldweather.git
cd helloworldweather
```

2. Install dependencies:
```bash
npm install
```

3. Create a configuration file `default.json` in the project root:
```json
{
  "defaultLocation": {
    "city": "Los Angeles",
    "state": "California",
    "country": "USA"
  },
  "openWeatherApiKey": "your_api_key_here"
}
```

4. Get your OpenWeather API key:
   - Visit [OpenWeather API](https://openweathermap.org/api)
   - Sign up for a free account
   - Generate an API key
   - Replace `your_api_key_here` in the configuration file

### Running the Application

Start the development server:
```bash
npm start
```

The application will open in your browser at `http://localhost:3000`.

## Usage

### Basic Weather Information
- The app loads with weather data for the default location (Los Angeles, CA)
- Navigate through different sections using the on-screen navigation
- View current weather conditions, temperature, and other meteorological data

### City Selection
- Use the dropdown to select from popular cities
- Enter a custom city name in the search field
- The app will validate the city and fetch weather data automatically

### AI Weather Assistant
- Navigate to the prompt section
- Ask natural language questions like:
  - "Will it rain tomorrow?"
  - "What's the humidity like?"
  - "Is it good weather for outdoor activities?"
- Get intelligent, contextual responses powered by OpenWeather's AI

## Configuration

### Environment Variables

Create a `default.json` file with the following structure:

```json
{
  "defaultLocation": {
    "city": "Your City",
    "state": "Your State/Province",
    "country": "Your Country"
  },
  "openWeatherApiKey": "your_openweather_api_key"
}
```

### API Integration

This application uses the following OpenWeather APIs:
- [Current Weather Data API](https://openweathermap.org/api)
- [AI Weather Assistant API](https://openweathermap.org/api/one-call-3#ai_weather_assistant)

## Project Structure

```
helloworldweather/
├── public/
├── src/
│   ├── components/
│   ├── services/
│   └── utils/
├── default.json
├── package.json
└── README.md
```

## Technologies Used

- **Frontend**: React.js
- **Weather Data**: OpenWeather API
- **AI Integration**: OpenWeather AI Weather Assistant
- **Runtime**: Web Browser

## Development Status

- ✅ Environment setup
- ✅ Basic weather data retrieval
- ✅ Weather data display
- ✅ Navigation system  
- ✅ AI prompt functionality
- ✅ AI response display
- 🔄 Custom city entry (in progress)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [OpenWeather](https://openweathermap.org/) for providing weather data and AI capabilities
- React.js community for the excellent framework

---

**Note**: This is a demonstration project showcasing the integration of AI-powered weather services. Remember to keep your API keys secure and never commit them to version control.