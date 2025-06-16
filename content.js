// Content script for the extension
// Ensure the script is only initialized once in this context
if (window.syllableBreakerInitialized) {
  console.log("Content: Content script already initialized. Skipping re-initialization.");
} else {
  window.syllableBreakerInitialized = true;
  console.log("Content: Content script initialized for the first time.");

  let syllablePopup = null;
  let lastMouseX = 0;
  let lastMouseY = 0;
  let currentLanguage = 'en'; // Default language set to English

  // Translation object - Only English translations needed if no language selection
  const translations = {
    en: {
      popupTitle: "Syllable Breaker",
      originalText: "Original Word:",
      syllables: "Syllables:",
      meaning: "Meaning:",
      bengaliPronunciationLabel: "উচ্চারণ:" // Added Bengali pronunciation label
    }
  };

  // Listen for messages from background script
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Content: Received message:", request);
    
    if (request.action === "checkContentScript") {
      sendResponse({ status: "loaded" });
      return true;
    }
    
    if (request.action === "breakSyllables") {
      console.log("Content: Breaking syllables for text:", request.text);
      showSyllablePopup(request.text);
      sendResponse({ status: "success" });
      return true;
    }
  });

  // Function to show syllable popup
  function showSyllablePopup(text) {
    console.log("Content: showSyllablePopup called with text:", text);
    
    // Close existing popup if any
    closePopup();
    
    // Get syllables from background script
    chrome.runtime.sendMessage({ action: "getSyllables", text: text }, (response) => {
      if (chrome.runtime.lastError) {
        console.error("Content: Error getting syllables:", chrome.runtime.lastError);
        return;
      }
      
      console.log("Content: Received syllables response:", response);
      
      // Get meaning and pronunciation
      chrome.runtime.sendMessage({ action: "getMeaning", text: text }, (meaningResponse) => {
        if (chrome.runtime.lastError) {
          console.error("Content: Error getting meaning:", chrome.runtime.lastError);
          meaningResponse = { meaning: "Error fetching meaning.", pronunciation: "" };
        }
        
        console.log("Content: Received meaning response:", meaningResponse);
        
        // Display the popup with syllables, meaning, and pronunciation
        displaySyllables(text, response.syllables, meaningResponse.meaning, meaningResponse.pronunciation);
      });
    });
  }

  // Function to speak the original word
  function speakWord(word, isBengali) {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = isBengali ? 'bn-IN' : 'en-US';
      utterance.rate = 0.8;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      const voices = speechSynthesis.getVoices();
      let selectedVoice = null;

      if (isBengali) {
        selectedVoice = voices.find(voice => voice.lang === 'bn-IN' || voice.lang.startsWith('bn-'));
        if (!selectedVoice) {
          console.warn('Content: Bengali voice (bn-IN) not found. Using default voice.');
        }
      } else {
        selectedVoice = voices.find(voice => voice.lang === 'en-US' || voice.lang.startsWith('en-'));
        if (!selectedVoice) {
          console.warn('Content: English voice (en-US) not found. Using default voice.');
        }
      }
      
      if (selectedVoice) {
        utterance.voice = selectedVoice;
        console.log('Content: Using voice:', selectedVoice.name, 'for language:', utterance.lang);
      }
      
      utterance.onend = () => {
        console.log('Content: Speech finished for word:', word);
      };
      
      utterance.onerror = (e) => {
        console.error('Content: Speech synthesis error for word:', word, e);
        alert('Pronunciation not available. Please ensure the correct speech pack is installed on your OS.');
      };
      
      speechSynthesis.speak(utterance);
      console.log('Content: Attempting to speak word:', word, 'in language:', utterance.lang);
    } else {
      console.warn('Content: SpeechSynthesis API not supported in this browser.');
      alert('Your browser does not support Speech Synthesis.');
    }
  }

  // Function to speak translation
  function speakTranslation(text, language) {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'bengali' ? 'bn-IN' : 'en-US';
      utterance.rate = 0.8;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      const voices = speechSynthesis.getVoices();
      let selectedVoice = null;

      if (language === 'bengali') {
        selectedVoice = voices.find(voice => voice.lang === 'bn-IN' || voice.lang.startsWith('bn-'));
        if (!selectedVoice) {
          console.warn('Content: Bengali voice (bn-IN) not found. Using default voice.');
        }
      } else {
        selectedVoice = voices.find(voice => voice.lang === 'en-US' || voice.lang.startsWith('en-'));
        if (!selectedVoice) {
          console.warn('Content: English voice (en-US) not found. Using default voice.');
        }
      }
      
      if (selectedVoice) {
        utterance.voice = selectedVoice;
        console.log('Content: Using voice:', selectedVoice.name, 'for language:', utterance.lang);
      }
      
      utterance.onend = () => {
        console.log('Content: Speech finished for translation:', text);
      };
      
      utterance.onerror = (e) => {
        console.error('Content: Speech synthesis error for translation:', text, e);
        alert('Pronunciation not available. Please ensure the correct speech pack is installed on your OS.');
      };
      
      speechSynthesis.speak(utterance);
      console.log('Content: Attempting to speak translation:', text, 'in language:', utterance.lang);
    } else {
      console.warn('Content: SpeechSynthesis API not supported in this browser.');
      alert('Your browser does not support Speech Synthesis.');
    }
  }

  // Function to display syllables in popup
  function displaySyllables(originalText, syllables, wordMeaning, wordPronunciation) {
    console.log("Content: displaySyllables called with:", { originalText, syllables, wordMeaning, wordPronunciation });
    
    // Create popup container
    syllablePopup = document.createElement('div');
    syllablePopup.className = 'syllable-popup';
    
    // Check if text contains Bengali characters
    const isBengali = /[\u0980-\u09FF]/.test(originalText);
    console.log("Content: Is text Bengali?", isBengali);
    
    // Convert newlines to HTML line breaks for meaning
    const formattedMeaning = wordMeaning ? wordMeaning.replace(/\n/g, '<br>') : '';
    
    // Extract English and Bengali parts from meaning
    let englishPart = '';
    let bengaliPart = '';
    
    if (wordMeaning) {
      const lines = wordMeaning.split('\n');
      if (lines.length >= 2) {
        englishPart = lines[0].replace('English: ', '');
        bengaliPart = lines[1].replace('বাংলা: ', '');
      }
    }
    
    // Create popup content
    syllablePopup.innerHTML = `
      <div class="popup-header">
        <h3>${translations.en.popupTitle}</h3>
        <button class="close-btn">×</button>
      </div>
      <div class="popup-content">
        <div class="original-text">
          <strong>${translations.en.originalText}</strong> ${originalText}
          <button class="speak-btn" title="Listen to original word">🔊</button>
        </div>
        
        <div class="syllables-section">
          <strong>${translations.en.syllables}</strong>
          <div class="syllables-list">
            ${syllables.map(syllable => `<span class="syllable">${syllable}</span>`).join('')}
          </div>
        </div>
        
        ${wordMeaning ? `
        <div class="word-meaning">
          <strong>${translations.en.meaning}</strong><br>
          <div class="meaning-content">
            <div class="english-meaning">
              ${englishPart}
              <button class="speak-translation-btn" data-text="${englishPart}" data-lang="english" title="Listen to English meaning">🔊</button>
            </div>
            <div class="bengali-meaning">
              ${bengaliPart}
              <button class="speak-translation-btn" data-text="${bengaliPart}" data-lang="bengali" title="Listen to Bengali meaning">🔊</button>
            </div>
          </div>
        </div>
        ` : ''}
        
        ${isBengali && wordPronunciation ? `
        <div class="word-pronunciation">
          <strong>${translations.en.bengaliPronunciationLabel}</strong> ${wordPronunciation}
        </div>
        ` : ''}
      </div>
    `;
    
    // Add popup to page
    document.body.appendChild(syllablePopup);
    
    // Add event listener for close button
    const closeBtn = syllablePopup.querySelector('.close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        closePopup();
      });
    }
    
    // Add event listener for speak button
    const speakBtn = syllablePopup.querySelector('.speak-btn');
    if (speakBtn) {
      speakBtn.addEventListener('click', () => {
        speakWord(originalText, isBengali);
      });
    }
    
    // Add event listeners for translation speak buttons
    const translationBtns = syllablePopup.querySelectorAll('.speak-translation-btn');
    translationBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const text = btn.getAttribute('data-text');
        const lang = btn.getAttribute('data-lang');
        speakTranslation(text, lang);
      });
    });
    
    // Add click outside to close functionality
    document.addEventListener('click', closePopupOnOutsideClick);
    
    console.log("Content: Popup created and added to page");
  }

  // Function to close popup when clicking outside
  function closePopupOnOutsideClick(event) {
    if (syllablePopup && !syllablePopup.contains(event.target)) {
      closePopup();
    }
  }

  // Function to close popup
  function closePopup() {
    if (syllablePopup) {
      syllablePopup.remove();
      syllablePopup = null;
      document.removeEventListener('click', closePopupOnOutsideClick);
    }
  }

  // Store mouse position for potential future use
  document.addEventListener('mousemove', (e) => {
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
  });

  console.log("Content: Content script setup complete");
} 