You are an expert AI developer tasked with creating the code structure and core logic for a Google Chrome Extension.

Project Goal: Build a Quranic Chrome Extension that allows users to read and listen to the Quran, inspired by the provided UI example (vertical list of Ayahs).

# Implementation Status

✅ = Completed | 🔄 = In Progress | ⏭️ = Future Enhancement

## Core Requirements:

✅ Platform: Google Chrome Extension.

✅ Manifest Version: Use Manifest V3.

## User Interface (UI):

✅ Originally implemented as a Popup Window, upgraded to a Sidebar for better user experience.

✅ Top Section: Includes a Search Bar and scrollable list to allow users to easily find and select a Surah.

✅ Reciter Selection: Includes a dropdown menu to allow users to choose from multiple audio reciters.

✅ Main Content Area: Displays a vertically scrollable list of all Ayahs belonging to the selected Surah.

✅ Two-step navigation flow: Users first see Surah list, then Ayah view after selection.

✅ Added "Back to Surahs" button for easy navigation.

✅ Added "Play Entire Surah" button with pause/resume functionality.

✅ Added loading indicators and error messages with retry options.

## Ayah Item Layout (for each Ayah in the list):

✅ Display the Ayah number in a stylish circle.

✅ Display the Arabic text of the Ayah prominently with beautiful typography.

✅ Include a Play button specific to that Ayah to trigger audio playback.

✅ Special handling for Bismillah to properly display it as a header.

⏭️ (Future) Add translations as an optional feature.

## Data Source:

✅ Successfully integrated with the api.alquran.cloud API.

✅ Fetch the list of all Surahs (for the search/selection).

✅ Fetch the list of available audio reciters (editions) supported by the API.

✅ For the selected Surah and Reciter, fetch all Ayahs including their Arabic text and audio URLs.

✅ Added robust error handling for API requests.

## Technology:

✅ Used standard HTML, CSS, and JavaScript.

✅ Used JavaScript fetch API with async/await for API interactions.

✅ Used HTML5 <audio> element for audio playback.

✅ Implemented CSS styling with modern design patterns:
   - Dark theme with green/gold accent colors
   - Card-like layout for each Ayah
   - Loading spinners and error messages
   - Visual indicators for currently playing Ayah

✅ Refactored JavaScript into a modular architecture:
   - app.js - Main application initialization
   - config.js - Configuration constants
   - api.js - API communication layer
   - ui.js - UI rendering logic
   - player.js - Audio playback functionality
   - utils.js - Helper functions

## State Management:

✅ Used chrome.storage.local to save and retrieve:
   - The last selected Surah
   - The last selected Reciter

✅ The extension loads the last state when opened.

## Permissions (in manifest.json):

✅ Included storage permission for saving user state.

✅ Included necessary host permissions.

## File Structure:

✅ Created all necessary files:
   - manifest.json
   - popup.html (used as the sidebar interface)
   - style.css
   - background.js (for sidebar functionality)
   - js/ directory with modular JavaScript files

## Special Features Added:

✅ **Sidebar Interface**: Converted from popup to sidebar for better usability.

✅ **Bismillah Handling**: Properly handles the Bismillah for different Surahs by relying on the API-provided Bismillah text and special formatting in the UI.

✅ **Play All Functionality**: Added ability to play the entire Surah with pause/resume.

✅ **Visual Feedback**: Currently playing Ayah is highlighted and scrolled into view.

✅ **Error Handling**: User-friendly error messages with retry functionality.

✅ **Modular Architecture**: Codebase organized into logical modules for better maintainability.

## Future Enhancements:

⏭️ Add translations
⏭️ Implement bookmarks/favorites
⏭️ Add progress tracking
⏭️ Support for different Quran reading modes