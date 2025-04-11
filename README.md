# Weather App

A responsive, mobile-friendly weather web app featuring real-time forecasts, city temperature comparisons, and an interactive mini-game called StormDodger. With a clean UI, dynamic weather-based backgrounds, and full bilingual support (Finnish & English), the app provides a sleek and practical user experience.

Built using HTML, CSS, and JavaScript.

![Weather App Gif](https://github.com/user-attachments/assets/0f2d4515-3931-4ade-91b9-50164fcd49cc)
![Weather App Gif2](https://github.com/user-attachments/assets/e7502282-eaf0-46bb-b17d-8daab260f9f6)

# Live Demo

[▶️ View it live](https://andytrix.github.io/weather-app/index.html)

# Contents

- [Introduction](#weather-app)
- [Live Demo](#live-demo)
- [Directory Structure](#directory-structure)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Installation & Setup](#installation--setup)
- [API Key Handling](#api-key-handling)
- [License](#license)

# Directory Structure

```bash
weather-app/
├── index.html           # Landing page
├── calculator.html      # City comparison page
├── weather.html         # Weather details page
├── game.html            # StormDodger mini-game
├── about.html           # About & info page
├── css/
│   └── style.css        # Main stylesheet
├── img/
│   ├── clear.jpg        # Background for clear weather
│   ├── cloudy.jpg       # Background for cloudy weather
│   ├── default.jpg      # Default background image
│   ├── player.png       # Game player sprite
│   ├── rain.jpg         # Background for rain
│   └── snow.jpg         # Background for snow
├── js/
│   ├── calculator.js    # Comparison logic
│   ├── game.js          # StormDodger game logic
│   └── script.js        # Core app logic and translation
├── .gitignore
├── LICENSE
└── README.md
```

# Features

- **Real-Time Weather** — Search weather by city or geolocation
- **Weather Details** — Shows temperature, description, humidity, wind, dressing tips, and weather-based background
- **City Comparison** — Compare temperatures between two cities
- **StormDodger Mini-Game** — Dodge falling raindrops in a weather-themed arcade experience
- **Language Toggle** — Switch between Finnish and English
- **Storage Support** — Uses sessionStorage for API key and localStorage for city/background memory
- **Responsive Design** — Optimized for both desktop and mobile

# Technology Stack

- Frontend: HTML5, CSS3, JavaScript
- API: [OpenWeatherMap](https://openweathermap.org/api)
- Storage: sessionStorage & localStorage

# Installation & Setup

**1. Clone the Repository**

```bash
git clone https://github.com/andytrix/weather-app.git
cd weather-app
```

**2. Open Locally**

Open `index.html` in your browser.

**3. Add Your API Key**

The app will prompt for your OpenWeatherMap API key. Get one [here](https://openweathermap.org/api).

# API Key Handling

- Your key is **not saved permanently**
- Stored temporarily using `sessionStorage`
- Keeps your API key private and safe from exposure


# License

This project is licensed under the terms described in the [LICENSE](./LICENSE) file.
