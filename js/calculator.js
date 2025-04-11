// Set the background image from the previous view
const bg = localStorage.getItem("latestBgImage") || "default.jpg";
document.body.style.backgroundImage = `url('img/${bg}')`;
document.body.style.backgroundSize = "cover";
document.body.style.backgroundPosition = "center";
document.body.style.backgroundRepeat = "no-repeat";

// DOM elements and API key
const form = document.getElementById("tempCompareForm");
const city1Input = document.getElementById("city1");
const city2Input = document.getElementById("city2");
const inputBox = document.getElementById("inputBox");
const resultBox = document.getElementById("result");
const instruction = document.getElementById("instruction");
const apiKey = sessionStorage.getItem("weatherApiKey");

// If the key is missing (e.g. user opened this page directly), redirect to homepage
if (!apiKey) {
  alert("API key is missing. You will be redirected to the homepage to enter it.");
  window.location.href = "index.html";
}

// Get the current language from localStorage
const getLang = () => localStorage.getItem("lang") || "fi";

// Translations for multilingual support
const translations = {
  compareTitle: { fi: "Lämpötilavertailu", en: "Temperature Comparison" },
  instruction: {
    fi: "Syötä kaksi kaupungin nimeä ja katso, kummassa on lämpimämpää!",
    en: "Enter two city names to compare which one is warmer!"
  },
  resultTitle: {
    fi: "Tässä ovat vertailun tulokset:",
    en: "Here are the comparison results:"
  },
  sameTemp: {
    fi: "Sama lämpötila molemmissa kaupungeissa.",
    en: "Same temperature in both cities."
  },
  warmer: {
    fi: "Lämpimämpi sää on kaupungissa {city}.",
    en: "The warmer weather is in {city}."
  },
  tempDiff: {
    fi: "Lämpötilaero:",
    en: "Temperature difference:"
  },
  newCompare: {
    fi: "Uusi vertailu",
    en: "New Comparison"
  },
  error: {
    fi: "Virhe haettaessa säätietoja. Tarkista kaupunkien nimet.",
    en: "Error fetching weather data. Please check the city names."
  }
};

// Event listener for the form submission
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const city1 = city1Input.value.trim();
  const city2 = city2Input.value.trim();

  if (!city1 || !city2) return;

  const lang = getLang();

  // Fetch weather data for both cities
  Promise.all([
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city1)}&appid=${apiKey}&units=metric&lang=${lang}`).then((res) => res.json()),
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city2)}&appid=${apiKey}&units=metric&lang=${lang}`).then((res) => res.json())
  ])
    .then(([data1, data2]) => {
      // Extract temperatures and calculate the difference
      const temp1 = data1.main.temp;
      const temp2 = data2.main.temp;
      const diff = Math.abs(temp1 - temp2).toFixed(1);

      // Determine which city is warmer or if they have the same temperature
      let tempMsg = "";
      if (temp1 > temp2) {
        tempMsg = translations.warmer[lang].replace("{city}", data1.name);
      } else if (temp2 > temp1) {
        tempMsg = translations.warmer[lang].replace("{city}", data2.name);
      } else {
        tempMsg = translations.sameTemp[lang];
      }

      // Update the UI with the results
      instruction.textContent = translations.resultTitle[lang];
      inputBox.style.display = "none";
      resultBox.innerHTML = `
        <div style="margin-top: -1.5rem;">
          <p><strong>${data1.name}:</strong> ${temp1} °C, ${data1.weather[0].description}</p>
          <p><strong>${data2.name}:</strong> ${temp2} °C, ${data2.weather[0].description}</p>
          <p><strong>${translations.tempDiff[lang]}</strong> ${diff} °C</p>
          <p><strong>${tempMsg}</strong></p>
          <button id="restartBtn" style="margin-top: 1rem; padding: 0.8rem 1.2rem; font-size: 1.1rem; background: linear-gradient(to right, #004c59, #004c59); color: white; border: none; border-radius: 14px; font-weight: 600; cursor: pointer;">
            ${translations.newCompare[lang]}
          </button>
        </div>`;

      // Add event listener to the restart button
      document.getElementById("restartBtn").addEventListener("click", () => {
        city1Input.value = "";
        city2Input.value = "";
        inputBox.style.display = "block";
        resultBox.innerHTML = "";
        instruction.textContent = translations.instruction[lang];
      });
    })
    .catch(() => {
      resultBox.innerHTML = `<p>${translations.error[getLang()]}</p>`;
    });
});
