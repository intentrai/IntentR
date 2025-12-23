# HelloWorldWeather

A simple weather application that combines real-time weather data with AI-powered weather insights. Built with React.js, this app provides both traditional weather information and intelligent responses to weather-related questions using OpenWeather's AI capabilities.

## Features

- 🌤️ **Real-time Weather Data** - Current weather conditions for any city
- 🤖 **AI Weather Assistant** - Ask natural language questions about weather conditions
- 📍 **Location Support** - Default location (Los Angeles) with custom city selection
- 🔍 **City Search** - Dropdown selection or manual city entry with validation
- 📱 **Web-based Interface** - Runs entirely in the browser
- 🎯 **Intuitive Navigation** - Easy-to-use interface for different app sections

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

3. Create a configuration file:
```bash
cp default.json.example default.json
```

4. Configure your OpenWeather API key and default location in `default.json`:
```json
{
  "defaultLocation": {
    "city": "Los Angeles",
    "state": "California",
    "country": "USA"
  },
  "apiKey": "your_openweather_api_key_here"
}
```

### Setup OpenWeather API

1. Sign up for a free account at [OpenWeatherMap](https://openweathermap.org/api)
2. Generate an API key
3. Ensure you have access to the [One Call API 3.0](https://openweathermap.org/api/one-call-3) with AI features

## Usage

### Starting the Application

```bash
npm start
```

The application will start and be available at `http://localhost:3000`

### Basic Usage

1. **View Default Weather**: The app loads with weather data for Los Angeles by default
2. **Select a City**: Use the dropdown to select from popular cities or manually enter a city name
3. **Ask Weather Questions**: Use the prompt field to ask natural language questions like:
   - "Will it rain tomorrow?"
   - "What should I wear today?"
   - "Is it good weather for outdoor activities?"
4. **Navigate**: Use the navigation menu to access different sections of the app

### Example Weather Prompts

- "What's the weather like for the next 3 days?"
- "Should I bring an umbrella today?"
- "Is it good weather for a picnic this weekend?"
- "What's the UV index like today?"

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```bash
REACT_APP_OPENWEATHER_API_KEY=your_api_key_here
REACT_APP_DEFAULT_CITY=Los Angeles
```

### Default Configuration

The `default.json` file contains:
- Default location settings
- API configuration
- Application preferences

## API Integration

This application uses OpenWeather's APIs:

- **Current Weather API** - For real-time weather data
- **One Call API 3.0** - For detailed weather information
- **AI Weather Assistant** - For intelligent weather responses

Learn more about the [OpenWeather AI capabilities](https://openweathermap.org/api/one-call-3#ai_weather_assistant).

## Project Structure

```
helloworldweather/
├── src/
│   ├── components/     # React components
│   ├── services/       # API service functions
│   ├── utils/         # Utility functions
│   └── App.js         # Main application component
├── public/            # Static assets
├── default.json       # Default configuration
└── package.json       # Project dependencies
```

## Development

### Running in Development Mode

```bash
npm run dev
```

### Building for Production

```bash
npm run build
```

### Running Tests

```bash
npm test
```

## Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [OpenWeatherMap](https://openweathermap.org/) for providing weather data and AI capabilities
- React.js community for the excellent framework and resources