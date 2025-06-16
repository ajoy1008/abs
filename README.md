# ABC WORDS - Chrome Extension

A Chrome extension that breaks Bengali and English words into syllables, displays meanings, and provides pronunciation playback.

## Features

- **Syllable Breaking**: Automatically breaks Bengali and English words into syllables
- **Word Meanings**: Shows meanings in both English and Bengali
- **Pronunciation**: Text-to-speech pronunciation for words and meanings
- **Language Detection**: Automatically detects Bengali vs English words
- **User-Friendly Interface**: Clean popup interface with easy-to-use controls

## Installation (Manual)

### Method 1: Load Unpacked Extension

1. **Download the Extension**
   - Download all files from this repository
   - Extract to a folder on your computer

2. **Open Chrome Extensions Page**
   - Open Chrome browser
   - Go to `chrome://extensions/`
   - Or navigate: Menu → More tools → Extensions

3. **Enable Developer Mode**
   - Toggle on "Developer mode" in the top-right corner

4. **Load the Extension**
   - Click "Load unpacked" button
   - Select the folder containing your extension files
   - The extension should now appear in your extensions list

### Method 2: From ZIP File

1. **Download and Extract**
   - Download the ZIP file from this repository
   - Extract to a folder

2. **Load in Chrome**
   - Follow steps 2-4 from Method 1 above

## How to Use

1. **Install the Extension** using one of the methods above
2. **Navigate to any webpage** with Bengali or English text
3. **Right-click on any word** and select "ABC WORDS - Break into Syllables"
4. **View the results** in the popup that appears:
   - Syllable breakdown
   - Word meanings in English and Bengali
   - Pronunciation buttons for each part

## Voice Pack Installation

For proper pronunciation, install Bengali voice packs on your operating system:

### Windows
1. Go to Settings → Time & Language → Language
2. Add Bengali (India) language
3. Download speech pack when prompted
4. Restart browser

### macOS
1. Go to System Preferences → Language & Region
2. Add Bengali to preferred languages
3. Download additional voices if prompted

### Linux
1. Install speech synthesis packages:
   ```bash
   sudo apt-get install speech-dispatcher
   sudo apt-get install festvox-kallpc16k
   ```
2. Or use your distribution's package manager

## File Structure

```
ABC-WORDS/
├── manifest.json          # Extension configuration
├── background.js          # Background script for context menu
├── content.js            # Content script for webpage interaction
├── popup.html            # Extension popup interface
├── styles.css            # Styling for popup
├── uninstalled.html      # Uninstall page
└── README.md             # This file
```

## Features in Detail

### Syllable Breaking
- **Bengali**: Uses vowel-consonant patterns for syllable detection
- **English**: Uses predefined word lists and basic vowel-based rules

### Dictionary Integration
- **English Dictionary**: Uses dictionaryapi.dev for English meanings
- **Bengali Dictionary**: Includes built-in Bengali word database
- **Translation**: LibreTranslate API for additional translations

### Pronunciation
- **Text-to-Speech**: Uses browser's speech synthesis
- **Multiple Languages**: Supports both English and Bengali pronunciation
- **Separate Controls**: Individual speaker buttons for word, English meaning, and Bengali meaning

## Troubleshooting

### Extension Not Working
1. Check if extension is enabled in `chrome://extensions/`
2. Refresh the webpage you're testing on
3. Try disabling and re-enabling the extension

### No Pronunciation
1. Install voice packs for your operating system (see Voice Pack Installation above)
2. Check browser console for error messages
3. Ensure your system has text-to-speech capabilities

### Missing Meanings
1. Check internet connection (required for dictionary APIs)
2. Some words may not be in the dictionary database
3. Try different words to test functionality

## Development

### Prerequisites
- Basic knowledge of HTML, CSS, and JavaScript
- Chrome browser for testing

### Local Development
1. Clone this repository
2. Make changes to files
3. Go to `chrome://extensions/`
4. Click "Reload" on your extension
5. Test changes

### Building for Distribution
1. Ensure all files are in the correct structure
2. Create a ZIP file of the extension folder
3. Upload to Chrome Web Store or share via GitHub

## Contributing

1. Fork this repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

If you encounter any issues or have questions:
1. Check the troubleshooting section above
2. Create an issue in this repository
3. Ensure you've followed all installation steps correctly

## Version History

- **v1.0**: Initial release with basic syllable breaking and dictionary features
- **v1.1**: Added pronunciation support and improved UI
- **v1.2**: Enhanced Bengali dictionary and translation features
- **v1.3**: Added uninstall page and improved error handling

---

**Note**: This extension requires an internet connection for dictionary lookups and translations. Voice pronunciation requires appropriate voice packs to be installed on your operating system. 