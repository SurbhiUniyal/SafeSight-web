function speak(text, callback) {
  speechSynthesis.cancel(); // Stop any ongoing speech
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.onend = callback || (() => {});
  speechSynthesis.speak(utterance);
}


// Function to read the major headings and important info
function readHomePageContent() {
  const imp1 = document.getElementById("imp1").innerText;
  const imp2 = document.getElementById("imp2").innerText;
  const imp3 = document.getElementById("imp3").innerText;
  const imp = document.getElementsByClassName("impotant").innerText;

  // Sequentially read content
  speak(imp1, () => {
      speak(imp2, () => {
          speak(imp3, () => {
            speak(imp, () => {
              // Announce navigation instructions after the content
              speak("Press D to navigate to the Downloads page.");
            });
          });
      });
  });
}

  // Function to read the Downloads page content and provide keyboard shortcuts
  function readDownloadsPageContent() {
    speak(
      "Welcome to the Downloads page. Press I for India, U S for America, J A for Japan, C A for Canada, or G E for Germany to view available AI models."
    );
  }
  
  // Handle country selection with keyboard shortcuts
  document.addEventListener("keydown", (event) => {
    speechSynthesis.cancel(); // Stop ongoing speech if a key is pressed
    const key = event.key.toLowerCase(); // Handle both uppercase and lowercase input
  
    // Country selection shortcuts
    if (key === "i") {
      speak("India selected.", () => displayModels("India"));
    } else if (key === "u") {
      speak("United States selected.", () => displayModels("USA"));
    } else if (key === "j") {
      speak("Japan selected.", () => displayModels("Japan"));
    } else if (key === "c") {
      speak("Canada selected.", () => displayModels("Canada"));
    } else if (key === "g") {
      speak("Germany selected.", () => displayModels("Germany"));
    }
  
    // Handle model selection dynamically when models are displayed
    const selectedModels = document.querySelectorAll(".model-card");
    if (selectedModels.length > 0 && !isNaN(key)) {
      const modelIndex = parseInt(key) - 1;
      if (modelIndex >= 0 && modelIndex < selectedModels.length) {
        const selectedModel = selectedModels[modelIndex];
        const modelName = selectedModel.textContent;
        speak(`You selected Model ${modelName}`, () => showModelModal(modelName));
      }
    }

    if (key === "b") {
      const modelsSection = document.getElementById("models");
  const countriesSection = document.getElementById("countries");
  const mainSection = document.querySelector("main"); // Select the main tag
  const otherSections = document.querySelectorAll("body > *:not(main)"); // Select elements outside the main tag

  // Show other sections outside <main>
  otherSections.forEach((section) => {
      section.style.display = ""; // Restore original display state
  });

  // Hide the models section and show countries section
  modelsSection.style.display = "none";
  countriesSection.style.display = "flex";
  mainSection.style.display = "";
  
          // Announce country selection navigation
          speak(
              "You are now back to the country selection. Press I for India, U S for America, J A for Japan, C A for Canada, or G E for Germany to view available AI models."
          );
      }
  
  });
  

// Keyboard navigation for Downloads page
document.addEventListener('keydown', (event) => {
  if (event.key === 'd' || event.key === 'D') {
      speak("Navigating to the Downloads page.", () => {
          window.location.href = '/download.html';
      });
  }
});

// Run the appropriate page-specific function on page load
window.onload = () => {
    const currentPage = window.location.pathname.split('/').pop();
  
    if (currentPage === "index.html" || currentPage === "") {
        readHomePageContent(); // Calls the Home page display function, which already includes the announcement
    } else if (currentPage === "download.html") {
        readDownloadsPageContent(); // Calls the Download page display function, which already includes the announcement
    }
  };

const modelsData = {
  India: {
      Hindi: ["Model hindi 1.0", "Model hindi 1.1"],
      English: ["Model english 1.0", "Model english 2.0"],
      Punjabi: ["Model punjabi 1.2"],
      Marathi: ["Model marathi 2.0"],
      Gujarati: ["Model gujarati 2.1"],
  },
  USA: {
      English: ["Model english 3.0", "Model english 3.1"],
      Spanish: ["Model spanish 3.2"],
  },
  Canada: {
      English: ["Model english 4.0"],
      French: ["Model french 4.1", "Model french 4.2"],
  },
  Germany: {
      German: ["Model german 5.0", "Model german 5.1"],
  },
  Japan: {
      Japanese: ["Model japan 6.0", "Model japan 6.1"],
  },
};

// Handle country selection
document.querySelectorAll(".country-card").forEach((card) => {
  card.addEventListener("click", () => {
      const country = card.dataset.country;
      displayModels(country);
  });
});

// Display models for the selected country and provide voice guidance
function displayModels(country) {
  console.log(`Displaying models for: ${country}`);
  const modelsSection = document.getElementById("models");
  const countriesSection = document.getElementById("countries");
  const languageModels = document.getElementById("language-models");
  const mainSection = document.querySelector("main"); // Select the main tag
  const otherSections = document.querySelectorAll("body > *:not(main)"); // Select elements outside the main tag

  if (!modelsData[country]) {
      console.error(`No models found for country: ${country}`);
      return;
  }

  // Hide other sections outside <main>
  otherSections.forEach((section) => {
      section.style.display = "none";
  });

  // Show the <main> tag
  mainSection.style.display = "block";

  // Update header in the models section
  document.getElementById("selected-country").textContent = `Models for ${country}`;
  languageModels.innerHTML = "";

  const languages = modelsData[country];
  let modelCounter = 1; // Counter for keyboard shortcuts

  for (const [language, models] of Object.entries(languages)) {
      const languageDiv = document.createElement("div");
      languageDiv.classList.add("language");

      // Language heading
      const languageHeading = document.createElement("h3");
      languageHeading.textContent = language;
      languageDiv.appendChild(languageHeading);

      // Create container for model cards
      const modelCards = document.createElement("div");
      modelCards.classList.add("model-cards");

      models.forEach((model) => {
          const modelCard = document.createElement("div");
          modelCard.classList.add("model-card");
          modelCard.textContent = model;

          modelCard.addEventListener("click", () => {
              console.log(`Model card clicked: ${model}`);
              showModelModal(model); // Show modal with the selected model
          });

          modelCards.appendChild(modelCard);
          modelCounter++;
      });

      languageDiv.appendChild(modelCards);
      languageModels.appendChild(languageDiv);
  }

  // Show models section
  countriesSection.style.display = "none";
  modelsSection.style.display = "block";

  // Announce the models and their keyboard shortcuts
  const modelNames = Object.values(languages).flat();
  let announcement = "Available models: ";
  modelNames.forEach((model, index) => {
      announcement += `${model}, press ${index + 1} to select it. `;
  });
  announcement += "Press B to go back to the list of countries.";

  speak(announcement);
}

  
  /// Back button handler
document.getElementById("back-button").addEventListener("click", () => {
  speechSynthesis.cancel(); // Stop ongoing speech if a key is pressed
  console.log("Back to country selection.");

  const modelsSection = document.getElementById("models");
  const countriesSection = document.getElementById("countries");
  const mainSection = document.querySelector("main"); // Select the main tag
  const otherSections = document.querySelectorAll("body > *:not(main)"); // Select elements outside the main tag

  // Show other sections outside <main>
  otherSections.forEach((section) => {
      section.style.display = ""; // Restore original display state
  });

  // Hide the models section and show countries section
  modelsSection.style.display = "none";
  countriesSection.style.display = "flex";
  mainSection.style.display = "";

  // Announce navigation instructions
  speak(
      "You are now back to the country selection. Press I for India, U S for America, J A for Japan, C A for Canada, or G E for Germany to view available AI models."
  );
});

// Show model modal
function showModelModal(modelName) {
    const modal = document.getElementById("downloadModal");
    const modalContent = modal.querySelector(".modal-content");
  
    // Update modal content
    modalContent.querySelector("h4").textContent = `Download ${modelName}`;
    modalContent.querySelector("p").textContent = `You are about to download ${modelName}. Please confirm to proceed.`;
  
    // Display the modal
    modal.style.display = "block";
  
    // Add event listener for confirm button
    const confirmButton = document.getElementById("confirmBtn");
    confirmButton.replaceWith(confirmButton.cloneNode(true)); // Reset listeners
    document.getElementById("confirmBtn").addEventListener("click", () => {
      downloadModel(modelName);
      closeModal();
    });
  
    // Add event listener for cancel button
    document.getElementById("cancelBtn").addEventListener("click", closeModal);
  }
  
  // Function to close the modal
  function closeModal() {
    const modal = document.getElementById("downloadModal");
    modal.style.display = "none";
  }
  
  // Download AI model and flash to ESP32
function downloadModel(modelName) {
  speak(`Starting download of AI Model ${modelName}...`);
  const modelVersion = `${modelName}.bin`;

  const flashData = {
    model: modelVersion,  // Only model name is sent
  };

  fetch("http://localhost:5000/flash", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(flashData),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.message) {
        speak(`AI Model ${modelName} and audio successfully flashed to your SafeSight device!`);
      } else if (data.error) {
        speak(`Error: ${data.error}`);
      }
    })
    .catch((error) => {
      console.error("Error flashing model:", error);
      speak("Flashing failed. Please try again.");
    });
}


// Highlight the active page in the navigation
let currentPage = window.location.pathname.split("/").pop();

// Normalize root path to "index.html"
if (currentPage === "" || currentPage === "/") {
    currentPage = "index.html";
}

document.querySelectorAll(".nav-link").forEach((link) => {
    const linkPath = link.getAttribute("href");

    // Compare without leading slash
    if (linkPath === currentPage) {
        link.classList.add("active");
    } else {
        link.classList.remove("active");
    }
});


