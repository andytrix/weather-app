document.addEventListener("DOMContentLoaded", () => {
  // Get API key from sessionStorage or prompt
  let apiKey = sessionStorage.getItem("weatherApiKey");

  if (!apiKey) {
    apiKey = prompt("Enter your OpenWeatherMap API key to test the application:");

    if (!apiKey) {
      alert("An API key is required to fetch weather data");
      throw new Error("Missing API key");
    }

    // Save key to sessionStorage
    sessionStorage.setItem("weatherApiKey", apiKey);
  }

  // Language translations for FI and EN
  const translations = {
    fi: {
      title: "Sääsovellus",
      home: "Etusivu",
      compare: "Lämpötilavertailu",
      game: "StormDodger",
      about: "Tietoa",
      formLabel: "Syötä kaupungin nimi:",
      formButton: "Näytä sää",
      compareButton: "Vertaa lämpötilaa",
      missingCity: "Ei kaupunkia annettu. Palaa etusivulle.",
      errorFetch: "Virhe haettaessa säätietoja.",
      errorDenied: "Käyttäjä esti sijainnin haun.",
      errorUnavailable: "Sijaintia ei voitu määrittää.",
      errorTimeout: "Sijainnin haku aikakatkaistiin.",
      errorGeneric: "Sijaintia ei saatu.",
      noGeo: "Selaimesi ei tue sijainnin hakua.",
      temp: "Lämpötila",
      desc: "Kuvaus",
      humidity: "Kosteus",
      wind: "Tuuli",
      tip: "Vinkki",
      tip_clear: "Aurinkoinen päivä – aurinkolasit ja kevyt vaatetus!",
      tip_clouds: "Pilvistä – kevyt takki voi olla hyvä idea.",
      tip_rain: "Sataa – ota sateenvarjo mukaan!",
      tip_snow: "Lumisade – lämmin takki ja kengät suositeltavat!",
      tip_default: "Sää vaihtelee – pukeudu kerroksittain!",
      compareTitle: "Lämpötilavertailu",
      instruction: "Syötä kaksi kaupungin nimeä ja katso, kummassa on lämpimämpää!",
      city1Label: "Kaupunki 1:",
      city2Label: "Kaupunki 2:",
      aboutTitle: "Tietoa sovelluksesta",
      aboutP1: "Tämä web-sovellus tarjoaa sääpalveluita ja interaktiivisia ominaisuuksia käyttäjälle. Sää voidaan hakea syöttämällä kaupungin nimi tai sallimalla automaattinen paikannus.",
      aboutP2: "Näytettävät tiedot: <strong>lämpötila</strong>, <strong>sään kuvaus</strong>, <strong>kosteus</strong>, <strong>tuulen nopeus</strong>, <strong>pukeutumisvinkki</strong> sekä <strong>taustakuva</strong>, joka päivittyy sään mukaan. Viimeisin kaupunki ja taustakuva tallennetaan selaimen localStorageen.",
      aboutP3: "Käyttäjä voi myös verrata kahden kaupungin lämpötiloja keskenään sekä pelata <strong>StormDodger</strong>-nimistä minipeliä, jossa väistellään vesipisaroita.",
      aboutP4: "Sovellus on toteutettu osana Oulun ammattikorkeakoulun Web-sovellusten perusteet -kurssia keväällä 2025.",
      apiUsed: "Käytetty avoin rajapinta:",
      author: "Tekijä:",
      apiUsed: "<strong>Käytetty avoin rajapinta:</strong><br><a href='https://openweathermap.org/api' target='_blank'>OpenWeatherMap API</a>",
      author: "<strong>Tekijä:</strong><br>andytrix",
      gameInstruction: "Auta <strong>Vilua</strong> pysymään kuivana! Väistele putoavia sadepisaroita nuoli- tai A/D-näppäimillä. Puhelimella liikut napauttamalla ruudun reunoja. Peli päättyy heti, jos osut pisaraan.",
      scoreLabel: "Pisteet:"
    },
    en: {
      title: "Weather App",
      home: "Home",
      compare: "Temperature Comparison",
      game: "StormDodger",
      about: "About",
      formLabel: "Enter city name:",
      formButton: "Show weather",
      compareButton: "Compare temperatures",
      missingCity: "No city provided. Return to homepage.",
      errorFetch: "Error fetching weather data.",
      errorDenied: "User denied location access.",
      errorUnavailable: "Location could not be determined.",
      errorTimeout: "Location request timed out.",
      errorGeneric: "Location not available.",
      noGeo: "Your browser does not support geolocation.",
      temp: "Temperature",
      desc: "Description",
      humidity: "Humidity",
      wind: "Wind",
      tip: "Tip",
      tip_clear: "Sunny – sunglasses and light clothes!",
      tip_clouds: "Cloudy – a light jacket might help.",
      tip_rain: "Rainy – bring an umbrella!",
      tip_snow: "Snowy – wear a warm coat and boots!",
      tip_default: "Unstable weather – dress in layers!",
      compareTitle: "Temperature Comparison",
      instruction: "Enter two city names to compare which one is warmer!",
      city1Label: "City 1:",
      city2Label: "City 2:",
      aboutTitle: "About the application",
      aboutP1: "This web app provides weather services and interactive features for users. Weather can be retrieved by entering a city name or allowing automatic geolocation.",
      aboutP2: "Displayed data includes: <strong>temperature</strong>, <strong>weather description</strong>, <strong>humidity</strong>, <strong>wind speed</strong>, <strong>clothing tip</strong>, and a <strong>background image</strong> that updates based on the weather. The most recent city and background image are stored in your browser's localStorage.",
      aboutP3: "Users can also compare temperatures between two cities and play a mini-game called <strong>StormDodger</strong>, where they dodge raindrops.",
      aboutP4: "This app was created as part of the Frontend Web Development course at Oulu University of Applied Sciences in spring 2025.",
      apiUsed: "Open API used:",
      author: "Author:",
      apiUsed: "<strong>Open API used:</strong><br><a href='https://openweathermap.org/api' target='_blank'>OpenWeatherMap API</a>",
      author: "<strong>Author:</strong><br>andytrix",
      gameInstruction: "Help <strong>Vilu</strong> stay dry! Avoid falling raindrops using arrow or A/D keys. On mobile, move by tapping the screen edges. The game ends immediately if you get hit by a drop.",
      scoreLabel: "Score:"
    }
  };

  // Get the current language from localStorage or default to 'fi'
  let currentLang = localStorage.getItem("lang");
  if (!currentLang) {
    const userLang = navigator.language || navigator.userLanguage;
    currentLang = userLang.startsWith("fi") ? "fi" : "en";
    localStorage.setItem("lang", currentLang);
  }

  const getLang = () => localStorage.getItem("lang") || "fi";
  let latestCity = null;

  // Translate the page based on the selected language
  function translatePage() {
    const t = translations[getLang()];
    document.documentElement.lang = getLang();

    document.querySelectorAll("[data-key]").forEach(el => {
      const key = el.getAttribute("data-key");
      if (t[key]) el.innerHTML = t[key];
    });

    const toggleBtn = document.getElementById("langToggle");
    if (toggleBtn) {
      toggleBtn.textContent = getLang() === "fi" ? "EN" : "FI";
    }
  }

  // Update the language and re-translate the page
  function updateLanguage(lang) {
    currentLang = lang;
    localStorage.setItem("lang", lang);
    translatePage();

    updateAutoWeather();

    if (document.getElementById("weatherBox") && latestCity) {
      fetchWeather(latestCity, document.getElementById("weatherBox"));
    }

    if (window.location.pathname.includes("calculator.html")) {
      if (document.getElementById("result")?.innerHTML.trim() !== "") {
        document.querySelector("form#tempCompareForm")?.dispatchEvent(new Event("submit"));
      }
    }
  }

  // Language toggle button event listener
  document.getElementById("langToggle")?.addEventListener("click", () => {
    const newLang = getLang() === "fi" ? "en" : "fi";
    updateLanguage(newLang);
  });

  translatePage();

  // Handle mobile menu toggle
  const toggleBtn = document.querySelector(".menu-toggle");
  const navMenu = document.querySelector("nav.menu");
  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener("click", () => {
      navMenu.classList.toggle("show");
    });
  }

  // Fetch weather data for a specific city
  function fetchWeather(city, targetBox) {
    const lang = getLang();
    const savedBg = localStorage.getItem("latestBgImage") || "default.jpg";
    document.body.style.backgroundImage = `url('img/${savedBg}')`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric&lang=${lang}`;

    targetBox.innerHTML = `<p>${lang === "fi" ? "Haetaan säätietoja..." : "Loading weather data..."}</p>`;

    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error(translations[lang].errorFetch);
        return res.json();
      })
      .then(data => {
        const t = translations[lang];
        const weatherMain = data.weather[0].main.toLowerCase();
        let bgImage = "default.jpg";
        let tip = t.tip_default;

        if (weatherMain.includes("clear")) {
          bgImage = "clear.jpg";
          tip = t.tip_clear;
        } else if (weatherMain.includes("clouds")) {
          bgImage = "cloudy.jpg";
          tip = t.tip_clouds;
        } else if (weatherMain.includes("rain")) {
          bgImage = "rain.jpg";
          tip = t.tip_rain;
        } else if (weatherMain.includes("snow")) {
          bgImage = "snow.jpg";
          tip = t.tip_snow;
        }

        document.body.style.backgroundImage = `url('img/${bgImage}')`;
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";
        localStorage.setItem("latestBgImage", bgImage);

        targetBox.innerHTML = `
          <h2 style="font-weight: 600; margin-bottom: 1rem;">${data.name}, ${data.sys.country}</h2>
          <p><strong>${t.temp}:</strong> ${data.main.temp}°C</p>
          <p><strong>${t.desc}:</strong> ${data.weather[0].description}</p>
          <p><strong>${t.humidity}:</strong> ${data.main.humidity}%</p>
          <p><strong>${t.wind}:</strong> ${data.wind.speed} m/s</p>
          <p><strong>${t.tip}:</strong> ${tip}</p>
        `;
      })
      .catch(error => {
        targetBox.innerHTML = `<p><strong>${error.message}</strong></p>`;
      });
  }

  const weatherBox = document.getElementById("weatherBox");
  if (weatherBox) {
    const params = new URLSearchParams(window.location.search);
    const city = params.get("city") || localStorage.getItem("latestCity");

    if (city) {
      latestCity = city;
      fetchWeather(city, weatherBox);
    } else {
      weatherBox.innerHTML = `<p>${translations[getLang()].missingCity}</p>`;
    }
  }

  // Update weather based on geolocation
  function updateAutoWeather() {
    const lang = getLang();
    const autoWeatherBox = document.getElementById("autoWeatherBox");
    if (!autoWeatherBox) return;

    const savedBg = localStorage.getItem("latestBgImage") || "default.jpg";
    document.body.style.background = `url('img/${savedBg}') no-repeat center center fixed`;
    document.body.style.backgroundSize = "cover";

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric&lang=${lang}`;

          fetch(url)
            .then(res => res.json())
            .then(data => {
              const city = data.name;
              const temp = data.main.temp;
              const desc = data.weather[0].description;
              const main = data.weather[0].main.toLowerCase();

              autoWeatherBox.innerHTML = `
                <h2>${city}</h2>
                <p>${desc}, ${temp.toFixed(1)} °C</p>
              `;
              autoWeatherBox.classList.add("show");

              let bg = "default.jpg";
              if (main.includes("clear")) bg = "clear.jpg";
              else if (main.includes("clouds")) bg = "cloudy.jpg";
              else if (main.includes("rain")) bg = "rain.jpg";
              else if (main.includes("snow")) bg = "snow.jpg";

              document.body.style.background = `url('img/${bg}') no-repeat center center fixed`;
              document.body.style.backgroundSize = "cover";
              localStorage.setItem("latestBgImage", bg);
            })
            .catch(() => {
              autoWeatherBox.innerHTML = `<p>${translations[lang].errorFetch}</p>`;
              autoWeatherBox.classList.add("show");
            });
        },
        error => {
          const t = translations[lang];
          let message = t.errorGeneric;
          if (error.code === 1) message = t.errorDenied;
          else if (error.code === 2) message = t.errorUnavailable;
          else if (error.code === 3) message = t.errorTimeout;

          autoWeatherBox.innerHTML = `<p>${message}</p>`;
          autoWeatherBox.classList.add("show");
        },
        { timeout: 10000 }
      );
    } else {
      autoWeatherBox.innerHTML = `<p>${translations[lang].noGeo}</p>`;
      autoWeatherBox.classList.add("show");
    }
  }

  updateAutoWeather();

  // Handle city form submission
  const cityForm = document.getElementById("cityForm");
  if (cityForm) {
    cityForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const city = document.getElementById("cityInput").value.trim();
      if (city) {
        localStorage.setItem("latestCity", city);
        window.location.href = `weather.html?city=${encodeURIComponent(city)}`;
      }
    });
  }

  // Close mobile menu on link click or outside click
  document.addEventListener("click", (e) => {
    const nav = document.querySelector("nav.menu");
    const toggle = document.querySelector(".menu-toggle");

    // Do nothing if there's no mobile menu
    if (!nav || !nav.classList.contains("show")) return;

    // If clicking a link in the menu or outside -> close the menu
    const clickedInsideMenu = nav.contains(e.target);
    const clickedToggle = toggle.contains(e.target);
    if (!clickedToggle) {
      nav.classList.remove("show");
    }
  });
});

