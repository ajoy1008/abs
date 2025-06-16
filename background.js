// Background script for the extension
chrome.runtime.onInstalled.addListener(() => {
  // Create context menu item
  chrome.contextMenus.create({
    id: "syllable-breaker",
    title: "ABC WORDS",
    contexts: ["selection"]
  });
});

// Add listener for when the extension is uninstalled
chrome.management.onUninstalled.addListener((id) => {
  // Check if the uninstalled ID matches this extension's ID
  // Note: For security and privacy reasons, the ID passed to onUninstalled is often not the actual extension ID,
  // but a unique ID generated for the uninstallation event. So, this check might not be strictly necessary
  // unless you have multiple extensions interacting.
  chrome.tabs.create({ url: "uninstalled.html" });
});

let bengaliDictionary = {}; // Global variable to store the Bengali dictionary
let englishToBengaliDictionary = {}; // Dictionary for English to Bengali translations
let translationCache = {}; // Cache for API translations to avoid repeated calls
let useApiTranslation = false; // Setting to control API usage - set to false for faster performance

// Fetch Bengali dictionary on startup
async function fetchBengaliDictionary() {
  const dictionaryUrl = "https://raw.githubusercontent.com/MinhasKamal/BengaliDictionary/master/BengaliDictionary.json";
  try {
    const response = await fetch(dictionaryUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("Background: Raw dictionary data structure:", typeof data, Array.isArray(data) ? data.length : Object.keys(data).length);
    
    // Handle different possible structures of the BengaliDictionary.json
    if (Array.isArray(data)) {
      // If it's an array, convert to a map
      bengaliDictionary = data.reduce((acc, item) => {
        if (item.word || item.bengali || item.bn) {
          const word = item.word || item.bengali || item.bn;
          acc[word.toLowerCase()] = {
            meaning: item.meaning || item.english || item.en || "Meaning not available.",
            pronunciation: item.pronunciation || item.phonetic || item.phonetics || ""
          };
        }
        return acc;
      }, {});
    } else if (typeof data === 'object') {
      // If it's already an object, use it directly
      bengaliDictionary = data;
    }
    
    console.log("Background: Bengali dictionary loaded successfully. Sample entries:", Object.keys(bengaliDictionary).slice(0, 5));
  } catch (error) {
    console.error("Background: Failed to fetch Bengali dictionary:", error);
    // Fallback: Create a small sample dictionary for testing
    bengaliDictionary = {
      "আমি": { meaning: "I, me", pronunciation: "ami" },
      "তুমি": { meaning: "you", pronunciation: "tumi" },
      "সে": { meaning: "he/she", pronunciation: "she" },
      "আমরা": { meaning: "we", pronunciation: "amra" },
      "তোমরা": { meaning: "you (plural)", pronunciation: "tomra" },
      "তারা": { meaning: "they", pronunciation: "tara" },
      "ভালো": { meaning: "good", pronunciation: "bhalo" },
      "খারাপ": { meaning: "bad", pronunciation: "kharap" },
      "বড়": { meaning: "big", pronunciation: "boro" },
      "ছোট": { meaning: "small", pronunciation: "choto" }
    };
    console.log("Background: Using fallback Bengali dictionary.");
  }
}

// Create English to Bengali dictionary
function createEnglishToBengaliDictionary() {
  englishToBengaliDictionary = {
    "hello": "হ্যালো",
    "good": "ভালো",
    "bad": "খারাপ",
    "big": "বড়",
    "small": "ছোট",
    "water": "পানি",
    "food": "খাবার",
    "house": "বাড়ি",
    "car": "গাড়ি",
    "book": "বই",
    "sun": "সূর্য",
    "moon": "চাঁদ",
    "star": "তারা",
    "tree": "গাছ",
    "flower": "ফুল",
    "bird": "পাখি",
    "fish": "মাছ",
    "cat": "বিড়াল",
    "dog": "কুকুর",
    "man": "মানুষ",
    "woman": "মহিলা",
    "boy": "ছেলে",
    "girl": "মেয়ে",
    "mother": "মা",
    "father": "বাবা",
    "brother": "ভাই",
    "sister": "বোন",
    "friend": "বন্ধু",
    "teacher": "শিক্ষক",
    "student": "ছাত্র",
    "doctor": "ডাক্তার",
    "engineer": "ইঞ্জিনিয়ার",
    "computer": "কম্পিউটার",
    "phone": "ফোন",
    "television": "টেলিভিশন",
    "radio": "রেডিও",
    "newspaper": "সংবাদপত্র",
    "magazine": "পত্রিকা",
    "school": "স্কুল",
    "college": "কলেজ",
    "university": "বিশ্ববিদ্যালয়",
    "hospital": "হাসপাতাল",
    "market": "বাজার",
    "shop": "দোকান",
    "restaurant": "রেস্টুরেন্ট",
    "hotel": "হোটেল",
    "bank": "ব্যাংক",
    "post office": "ডাকঘর",
    "police station": "পুলিশ স্টেশন",
    "fire station": "ফায়ার স্টেশন",
    "library": "গ্রন্থাগার",
    "museum": "জাদুঘর",
    "park": "পার্ক",
    "garden": "বাগান",
    "road": "রাস্তা",
    "bridge": "সেতু",
    "river": "নদী",
    "mountain": "পাহাড়",
    "sea": "সমুদ্র",
    "ocean": "মহাসাগর",
    "forest": "বন",
    "desert": "মরুভূমি",
    "city": "শহর",
    "village": "গ্রাম",
    "country": "দেশ",
    "world": "পৃথিবী",
    "time": "সময়",
    "day": "দিন",
    "night": "রাত",
    "morning": "সকাল",
    "afternoon": "বিকাল",
    "evening": "সন্ধ্যা",
    "today": "আজ",
    "yesterday": "কাল",
    "tomorrow": "আগামীকাল",
    "week": "সপ্তাহ",
    "month": "মাস",
    "year": "বছর",
    "spring": "বসন্ত",
    "summer": "গ্রীষ্ম",
    "autumn": "শরৎ",
    "winter": "শীত",
    "red": "লাল",
    "blue": "নীল",
    "green": "সবুজ",
    "yellow": "হলুদ",
    "black": "কালো",
    "white": "সাদা",
    "brown": "বাদামি",
    "pink": "গোলাপি",
    "orange": "কমলা",
    "purple": "বেগুনি",
    "gray": "ধূসর",
    "one": "এক",
    "two": "দুই",
    "three": "তিন",
    "four": "চার",
    "five": "পাঁচ",
    "six": "ছয়",
    "seven": "সাত",
    "eight": "আট",
    "nine": "নয়",
    "ten": "দশ",
    // Additional common words
    "beautiful": "সুন্দর",
    "ugly": "কুৎসিত",
    "happy": "সুখী",
    "sad": "দুঃখী",
    "angry": "রাগান্বিত",
    "tired": "ক্লান্ত",
    "hungry": "ক্ষুধার্ত",
    "thirsty": "তৃষ্ণার্ত",
    "hot": "গরম",
    "cold": "ঠান্ডা",
    "warm": "উষ্ণ",
    "cool": "শীতল",
    "new": "নতুন",
    "old": "পুরানো",
    "young": "তরুণ",
    "rich": "ধনী",
    "poor": "দরিদ্র",
    "strong": "শক্তিশালী",
    "weak": "দুর্বল",
    "tall": "উচ্চ",
    "short": "খাটো",
    "fat": "মোটা",
    "thin": "চিকন",
    "fast": "দ্রুত",
    "slow": "ধীর",
    "easy": "সহজ",
    "difficult": "কঠিন",
    "important": "গুরুত্বপূর্ণ",
    "necessary": "প্রয়োজনীয়",
    "possible": "সম্ভব",
    "impossible": "অসম্ভব",
    "right": "ঠিক",
    "wrong": "ভুল",
    "true": "সত্য",
    "false": "মিথ্যা",
    "yes": "হ্যাঁ",
    "no": "না",
    "please": "অনুগ্রহ করে",
    "thank you": "ধন্যবাদ",
    "sorry": "দুঃখিত",
    "excuse me": "মাফ করবেন",
    "goodbye": "বিদায়",
    "welcome": "স্বাগতম",
    "love": "ভালোবাসা",
    "hate": "ঘৃণা",
    "like": "পছন্দ",
    "dislike": "অপছন্দ",
    "want": "চাই",
    "need": "প্রয়োজন",
    "have": "আছে",
    "give": "দাও",
    "take": "নাও",
    "come": "আসো",
    "go": "যাও",
    "see": "দেখো",
    "hear": "শোনো",
    "speak": "কথা বলো",
    "read": "পড়ো",
    "write": "লেখো",
    "eat": "খাও",
    "drink": "পান করো",
    "sleep": "ঘুমাও",
    "wake": "জাগো",
    "work": "কাজ",
    "play": "খেলা",
    "study": "পড়াশোনা",
    "learn": "শেখা",
    "teach": "শেখানো",
    "help": "সাহায্য",
    "understand": "বুঝা",
    "know": "জানা",
    "think": "ভাবা",
    "feel": "অনুভব করা",
    "remember": "মনে রাখা",
    "forget": "ভুলে যাওয়া",
    "find": "খুঁজে পাওয়া",
    "lose": "হারানো",
    "buy": "কিনা",
    "sell": "বিক্রি",
    "run": "দৌড়ানো",
    "walk": "হাঁটা",
    "talk": "কথা বলা",
    "sing": "গান গাওয়া",
    "dance": "নাচ করা",
    "draw": "আঁকা",
    "paint": "রং করা",
    "build": "তৈরি করা",
    "destroy": "ধ্বংস করা",
    "make": "তৈরি করা",
    "do": "করা",
    "get": "পাওয়া",
    "put": "রাখা",
    "take": "নেওয়া",
    "bring": "আনা",
    "send": "পাঠানো",
    "receive": "গ্রহণ করা",
    "show": "দেখানো",
    "hide": "লুকানো",
    "clean": "পরিষ্কার করা",
    "dirty": "নোংরা",
    "empty": "খালি",
    "full": "ভরা",
    "fast": "দ্রুত",
    "slow": "ধীর",
    "early": "আগে",
    "late": "দেরি",
    "long": "লম্বা",
    "short": "খাটো",
    "wide": "প্রশস্ত",
    "narrow": "সরু",
    "deep": "গভীর",
    "shallow": "অগভীর",
    "inside": "ভিতরে",
    "outside": "বাইরে",
    "up": "উপরে",
    "down": "নিচে",
    "left": "বাম",
    "right": "ডান",
    "front": "সামনে",
    "back": "পিছনে",
    "near": "কাছে",
    "far": "দূরে",
    "above": "উপরে",
    "below": "নিচে",
    "under": "নিচে",
    "over": "উপরে",
    "between": "মাঝে",
    "among": "মধ্যে",
    "with": "সাথে",
    "without": "ছাড়া",
    "and": "এবং",
    "or": "অথবা",
    "but": "কিন্তু",
    "if": "যদি",
    "because": "কারণ",
    "so": "তাই",
    "then": "তারপর",
    "when": "যখন",
    "where": "যেখানে",
    "why": "কেন",
    "how": "কিভাবে",
    "what": "কি",
    "who": "কে",
    "whom": "কাকে",
    "whose": "কার",
    "which": "কোনটি",
    "this": "এটি",
    "that": "ঐটি",
    "these": "এগুলো",
    "those": "ওগুলো",
    "here": "এখানে",
    "there": "সেখানে",
    "now": "এখন",
    "then": "তখন",
    "always": "সবসময়",
    "never": "কখনো না",
    "often": "প্রায়ই",
    "rarely": "দাচিৎ",
    "sometimes": "মাঝে মাঝে",
    "usually": "সাধারণত",
    "seldom": "কদাচিৎ",
    "every": "প্রতি",
    "all": "সব",
    "some": "কিছু",
    "any": "কোনো",
    "no": "না",
    "many": "অনেক",
    "much": "অনেক",
    "few": "কিছু",
    "little": "কম",
    "more": "আরও",
    "less": "কম",
    "most": "সর্বাধিক",
    "least": "সর্বনিম্ন",
    "good": "ভালো",
    "bad": "খারাপ",
    "better": "উত্তম",
    "worse": "খারাপতর",
    "best": "সর্বোত্তম",
    "worst": "সবচেয়ে খারাপ",
    "big": "বড়",
    "small": "ছোট",
    "larger": "বৃহত্তর",
    "smaller": "ক্ষুদ্রতর",
    "largest": "বৃহত্তম",
    "smallest": "ক্ষুদ্রতম",
    "happy": "সুখী",
    "sad": "দুঃখী",
    "happier": "অধিক সুখী",
    "sadder": "অধিক দুঃখী",
    "happiest": "সবচেয়ে সুখী",
    "saddest": "সবচেয়ে দুঃখী",
    "beautiful": "সুন্দর",
    "ugly": "কুৎসিত",
    "more beautiful": "অধিক সুন্দর",
    "less beautiful": "কম সুন্দর",
    "most beautiful": "সবচেয়ে সুন্দর",
    "least beautiful": "সবচেয়ে কম সুন্দর",
    "important": "গুরুত্বপূর্ণ",
    "unimportant": "অগুরুত্বপূর্ণ",
    "more important": "অধিক গুরুত্বপূর্ণ",
    "less important": "কম গুরুত্বপূর্ণ",
    "most important": "সর্বাধিক গুরুত্বপূর্ণ",
    "least important": "সবচেয়ে কম গুরুত্বপূর্ণ"
  };
}

// LibreTranslate API details
const LIBRETRANSLATE_URL = "https://libretranslate.com/translate";
const LIBRETRANSLATE_API_KEY = ""; // Add your API key if you have one

async function translateEnglishToBengali(word) {
  if (englishToBengaliDictionary[word.toLowerCase()]) {
    return englishToBengaliDictionary[word.toLowerCase()];
  }
  if (translationCache[word.toLowerCase()]) {
    return translationCache[word.toLowerCase()];
  }
  // Only use API if allowed (false by default for performance)
  if (!useApiTranslation) {
    return null; // Don't make API call if not enabled
  }
  
  try {
    const response = await fetch(LIBRETRANSLATE_URL, {
      method: "POST",
      body: JSON.stringify({
        q: word,
        source: "en",
        target: "bn",
        api_key: LIBRETRANSLATE_API_KEY
      }),
      headers: { "Content-Type": "application/json" }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    const translatedText = data.translatedText;
    translationCache[word.toLowerCase()] = translatedText; // Cache the result
    return translatedText;
  } catch (error) {
    console.error("Background: Failed to translate English to Bengali via API:", error);
    return null;
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getWordMeaning") {
    const word = request.word;
    // No preferredLanguage from content.js after recent rejections. This will default to existing logic.
    getWordMeaning(word).then(response => {
      sendResponse(response);
    });
    return true; // Indicates an asynchronous response
  } else if (request.action === "speak") {
    const text = request.text;
    const lang = request.lang;
    
    // Check if speech synthesis is supported
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang; // Set language for speech
      
      // Attempt to find a suitable voice
      const voices = speechSynthesis.getVoices();
      const voice = voices.find(v => v.lang === lang || v.lang.startsWith(lang + '-'));
      if (voice) {
        utterance.voice = voice;
      } else {
        console.warn(`No specific voice found for ${lang}. Using default voice.`);
      }

      speechSynthesis.speak(utterance);
    } else {
      console.error("Speech synthesis not supported in this browser.");
    }
  }
});

// Function to break text into syllables (supports basic Bengali and some English)
function breakIntoSyllables(text) {
  const isBengali = /[\u0980-\u09FF]/.test(text); // Check if text contains Bengali characters
  console.log("Background: Is text Bengali?", isBengali, "Text:", text);
  
  if (isBengali) {
    return breakBengaliIntoSyllables(text);
  } else {
    return breakEnglishIntoSyllables(text);
  }
}

// Function to break Bengali text into syllables (existing logic)
function breakBengaliIntoSyllables(text) {
  const bengaliVowels = ['অ', 'আ', 'ই', 'ঈ', 'উ', 'ঊ', 'ঋ', 'এ', 'ঐ', 'ও', 'ঔ'];
  const bengaliConsonants = ['ক', 'খ', 'গ', 'ঘ', 'ঙ', 'চ', 'ছ', 'জ', 'ঝ', 'ঞ', 'ট', 'ঠ', 'ড', 'ঢ', 'ণ', 'ত', 'থ', 'দ', 'ধ', 'ন', 'প', 'ফ', 'ব', 'ভ', 'ম', 'য', 'র', 'ল', 'শ', 'ষ', 'স', 'হ', 'ড়', 'ঢ়', 'য়'];
  const bengaliMatras = ['া', 'ি', 'ী', 'ু', 'ূ', 'ৃ', 'ে', 'ৈ', 'ো', 'ৌ'];
  
  const syllables = [];
  let currentSyllable = '';
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    
    if (bengaliVowels.includes(char)) {
      if (currentSyllable) {
        syllables.push(currentSyllable);
      }
      currentSyllable = char;
    } else if (bengaliConsonants.includes(char)) {
      currentSyllable += char;
    } else if (bengaliMatras.includes(char)) {
      currentSyllable += char;
      if (currentSyllable) {
        syllables.push(currentSyllable);
        currentSyllable = '';
      }
    } else if (char === '্') { // Halant
      // Halant makes the preceding consonant implicit vowel-less. It attaches to the consonant.
      // For simplicity, we are not adding it to currentSyllable as it's a modifier
      // and will be handled by the next character or end of word.
    } else if (char === ' ') {
      if (currentSyllable) {
        syllables.push(currentSyllable);
        currentSyllable = '';
      }
    } else {
      // Other characters like punctuation, numbers, or non-Bengali characters
      if (currentSyllable) {
        syllables.push(currentSyllable);
        currentSyllable = '';
      }
      syllables.push(char);
    }
  }
  
  if (currentSyllable) {
    syllables.push(currentSyllable);
  }
  
  // Filter out empty strings
  return syllables.filter(s => s.trim() !== '');
}

// Function to break English text into syllables (simplified)
function breakEnglishIntoSyllables(text) {
  // Very basic English syllable breaking rules for common words.
  // This is NOT a comprehensive phonetic syllable breaker.
  const specialEnglishSyllables = {
    "sunset": ["sun", "set"],
    "hello": ["he", "llo"],
    "apple": ["ap", "ple"],
    "banana": ["ba", "na", "na"],
    "computer": ["com", "pu", "ter"],
    "developer": ["de", "vel", "o", "per"],
    "extension": ["ex", "ten", "sion"]
  };

  const lowerCaseText = text.toLowerCase();

  if (specialEnglishSyllables[lowerCaseText]) {
    return specialEnglishSyllables[lowerCaseText];
  }

  // Handle words with hyphens
  if (text.includes('-')) {
    return text.split('-');
  }

  // Basic vowel-based splitting (very rudimentary)
  // This will likely not be accurate for all English words.
  const vowels = 'aeiouAEIOU';
  const syllables = [];
  let currentSyllable = '';

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    currentSyllable += char;

    if (vowels.includes(char) && i < text.length - 1) {
      // If the next character is a consonant and it's not the end of the word, potentially split
      const nextChar = text[i + 1];
      if (!vowels.includes(nextChar) && nextChar.match(/[a-zA-Z]/)) {
        // Check for common double consonants that stay together
        const twoCharSuffix = text.substring(i + 1, i + 3).toLowerCase();
        if (!(['sh', 'ch', 'th', 'ph', 'gh', 'wh', 'ck', 'ng', 'll', 'ss', 'zz'].includes(twoCharSuffix.substring(0, 2)) ||
              ['bl', 'br', 'cl', 'cr', 'dr', 'fl', 'fr', 'gl', 'gr', 'pl', 'pr', 'sc', 'sk', 'sl', 'sm', 'sn', 'sp', 'st', 'sw', 'tr', 'tw'].includes(twoCharSuffix.substring(0, 2)))) {
          syllables.push(currentSyllable);
          currentSyllable = '';
        }
      }
    }
  }

  if (currentSyllable) {
    syllables.push(currentSyllable);
  }

  // If no clear splits, return the whole word as one syllable (for unknown words)
  if (syllables.length === 0) {
    return [text];
  }

  // Filter out empty strings
  return syllables.filter(s => s.trim() !== '');
}

async function getWordMeaning(word) {
  const isBengaliWord = /[ঀ-\u09FF]/.test(word);
  let result = {
    originalWord: word,
    englishMeaning: "",
    bengaliMeaning: "",
    englishPronunciation: "",
    bengaliPronunciation: "" // Assuming we might have this from the Bengali dictionary
  };

  if (isBengaliWord) {
    const entry = bengaliDictionary[word.toLowerCase()];
    if (entry) {
      result.bengaliMeaning = entry.meaning; // Bengali meaning from the dictionary
      result.bengaliPronunciation = entry.pronunciation;
      // For English meaning of a Bengali word, use the existing 'meaning' in bengaliDictionary if it's English
      // Or we could implement a Bengali to English translation if needed, but for now, rely on existing data
      result.englishMeaning = entry.english || entry.en || "Meaning not available in English."; // assuming the bengaliDictionary has an English meaning field for a Bengali word.
    } else {
      result.bengaliMeaning = "অর্থ পাওয়া যায়নি।";
      // We could try translating the Bengali word to English here if necessary
      // For now, it's just 'Meaning not available in English.'
      result.englishMeaning = "Meaning not available in English.";
    }
  } else { // English word
    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`);
      if (!response.ok) {
        // If English meaning API fails
        result.englishMeaning = "Meaning not found.";
        result.bengaliMeaning = await translateEnglishToBengali(word) || "অনুবাদ পাওয়া যায়নি।";
      } else {
        const data = await response.json();
        if (data && data.length > 0) {
          const firstEntry = data[0];
          if (firstEntry.meanings && firstEntry.meanings.length > 0 && firstEntry.meanings[0].definitions && firstEntry.meanings[0].definitions.length > 0) {
            result.englishMeaning = firstEntry.meanings[0].definitions[0].definition;
          } else {
            result.englishMeaning = "Meaning not found.";
          }
          if (firstEntry.phonetics && firstEntry.phonetics.length > 0) {
            // Find an English pronunciation if available
            const englishPhonetic = firstEntry.phonetics.find(p => p.text && (p.audio || !p.audio)); // Prioritize with audio if possible
            if (englishPhonetic) {
                result.englishPronunciation = englishPhonetic.text;
            }
          }
        } else {
            result.englishMeaning = "Meaning not found.";
        }
        result.bengaliMeaning = await translateEnglishToBengali(word) || "অনুবাদ পাওয়া যায়নি।";
      }
    } catch (error) {
      console.error("Background: Failed to fetch English meaning from dictionary API:", error);
      result.englishMeaning = "Meaning not found (API error).";
      result.bengaliMeaning = await translateEnglishToBengali(word) || "অনুবাদ পাওয়া যায়নি।";
    }
  }
  return result;
} 