# Weather Dashboard

Simple weather website that shows current weather and 7-day forecast.

## What it does

This project has 2 pages:
- **index.html** - shows current weather (temp, wind speed, etc)
- **forecast.html** - shows 7 day forecast with max/min temps

You can search for any city worldwide and it shows weather for that place.

## Files

- `index.html` 
- `forecast.html` 
- `style.css` 
- `script.js`

## API Used

Open-Meteo Weather API - https://open-meteo.com/en/docs


## Features

- Search any city in the world
- Shows current temperature, wind speed, weather conditions, local time
- 7-day forecast with high/low temps
- Dark theme with darkslategray background
- Your selected city is saved (uses localStorage)
- Navigation buttons to switch between pages

## How it works

1. User searches for a city
2. JavaScript uses fetch() to call the Geocoding API and get coordinates
3. Then calls Weather API with those coordinates
4. Gets JSON data back
5. Updates the page with the weather info
6. Each page makes its own API call

## Technologies

- HTML
- CSS 
- JavaScript (vanilla)
- Open-Meteo API (weather data)
- Open-Meteo Geocoding API (city search)

## Endpoints Used

**Current Weather:**
```
https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current_weather=true&timezone={timezone}
```

**7-Day Forecast:**
```
https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&daily=temperature_2m_max,temperature_2m_min&forecast_days=7&timezone={timezone}
```

**City Search:**
```
https://geocoding-api.open-meteo.com/v1/search?name={city}&count=5
```


**Endpoint:**

```
GET https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current_weather=true
```

---

## Displays:

**Current Weather**
* Temperature
* Wind speed
* Weather conditions
* Time
* Timezone

**7-Day Forecast**

* Date
* Max Temperature
* Min Temperature


