# Quran Chrome Extension

A Chrome extension for reading and listening to the Quran, featuring a modern sidebar interface, Surah search, reciter selection, and comprehensive audio playback options.

## Features

- Modern sidebar interface that integrates seamlessly with Chrome
- Search and browse all 114 Surahs of the Quran
- Two-step navigation (Surah list → Ayah view)
- Select from multiple audio reciters
- Play individual Ayahs or entire Surahs with one click
- Pause and resume playback functionality
- Proper Bismillah display with special handling for different Surahs
- Loading indicators and error handling for better user experience
- Responsive dark theme interface with beautiful typography
- Remembers your last selected Surah and Reciter
- Proper scrolling for both Surah list and Ayah content

## Installation

1. Clone or download this repository
2. Open Chrome and go to `chrome://extensions`
3. Enable "Developer mode" (toggle in top right corner)
4. Click "Load unpacked" and select the extension directory

## Usage

1. Click the extension icon in your Chrome toolbar to open the sidebar
2. Use the search box to find Surahs by name or number
3. Select a Surah from the list to view its Ayahs
4. Choose a reciter from the dropdown in the Ayah view
5. Click the individual play button (▶) next to any Ayah to listen to it
6. Click "Play Entire Surah" to play the whole Surah sequentially
7. Use the back button to return to the Surah list

## File Structure

- `manifest.json` - Extension configuration with sidebar support
- `popup.html` - Main extension interface (used in the sidebar)
- `style.css` - Styling for the extension
- `background.js` - Manages the extension's sidebar functionality
- `js/` - Modular JavaScript files:
  - `app.js` - Main application initialization and coordination
  - `config.js` - Configuration constants and default settings
  - `api.js` - API communication layer
  - `ui.js` - UI rendering and display logic
  - `player.js` - Audio playback functionality
  - `utils.js` - Helper functions and utilities

## Modular Architecture

The extension uses a modular architecture for better maintainability:

- **Config Module**: Contains all configuration constants and default settings
- **API Module**: Handles all communication with the Quran API
- **UI Module**: Manages rendering of Surahs, Ayahs, and UI components
- **Player Module**: Controls audio playback functionality
- **Utils Module**: Provides helper functions, including special Bismillah handling
- **App Module**: Coordinates the application and initializes all components

## API Usage

This extension uses the [Alquran Cloud API](https://alquran.cloud/api) for:
- Surah data (`/v1/surah`)
- Reciter/edition information (`/v1/edition/format/audio`)
- Ayah text and audio (`/v1/surah/{surahNumber}/{reciterIdentifier}`)

## Customization

To change the default reciter or Surah, modify these values in `js/config.js`:
```js
export const DEFAULT_SURAH = 1; // Default to Surah Al-Fatiha
export const DEFAULT_RECITER = 'ar.alafasy'; // Default reciter
```

## Dependencies

- Chrome browser (version supporting Manifest V3 and sidebar)
- Internet connection (for API access)

## Special Features

### Bismillah Handling
The extension properly handles the Bismillah (بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ) by:
- Displaying it as part of the first ayah when provided by the API.
- Special handling for Surah 9 (At-Tawbah) which doesn't have Bismillah.
- Special handling for Surah 1 (Al-Fatiha) where Bismillah is the first ayah.
- Relying on the API-provided Bismillah instead of adding a manual header.

### Error Handling
- Loading indicators during API requests
- User-friendly error messages when network issues occur
- Retry buttons to attempt failed requests again

## Future Enhancements

- Add translations
- Implement bookmarks/favorites
- Add progress tracking
- Support for different Quran reading modes