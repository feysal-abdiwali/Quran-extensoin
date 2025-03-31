# Quran Chrome Extension Plan

**1. Project Goal & Core Requirements:**

*   Build a Manifest V3 Chrome Extension to read/listen to the Quran.
*   UI: Popup with Surah search, Reciter selection, and Ayah list (Arabic text + Play button).
*   Data: `api.alquran.cloud` (Surahs, Reciters, Ayahs with audio).
*   Tech: HTML, CSS, JavaScript (`fetch`, `<audio>`).
*   State: Save last selected Surah & Reciter via `chrome.storage.local`.
*   Permissions: `storage`, `host_permissions` for the API.

**2. File Structure:**

```
quran-extension/
├── manifest.json
├── popup.html
├── popup.js
├── style.css
└── icons/
    (Will contain icon16.png, icon48.png, icon128.png - paths referenced in manifest)
```

**3. `manifest.json` (Manifest V3):**

*   Define basic extension info (`name`, `version`, `description`).
*   Specify `manifest_version: 3`.
*   Configure the `action` to use `popup.html`.
*   Request `permissions: ["storage"]`.
*   Request `host_permissions: ["https://api.alquran.cloud/*"]`.
*   Reference placeholder icon paths within the `icons` directory.

**4. `popup.html` (UI Structure):**

*   Standard HTML5 boilerplate.
*   Link to `style.css`.
*   Main container (`<div class="container">`).
*   **Top Section:**
    *   Surah Search: `<input type="text" id="surah-search" placeholder="Search Surah...">`
    *   Surah List: `<ul id="surah-list"></ul>` (dynamically populated).
*   **Reciter Selection:**
    *   `<select id="reciter-select"></select>` (dynamically populated).
*   **Content Area:**
    *   `<div id="ayah-container"></div>` (dynamically populated with Ayah items).
*   **Audio Player:**
    *   `<audio id="audio-player" controls style="width: 100%; margin-top: 10px;"></audio>` (controls might be hidden/styled later).
*   Link to `popup.js` at the end (`<script src="popup.js"></script>`).

**5. `style.css` (Styling):**

*   Basic reset/normalize.
*   Dark theme for `body` and main container.
*   Styling for `#surah-search` input.
*   Styling for `#surah-list` (scrollable, list item appearance).
*   Styling for `#reciter-select` dropdown.
*   Styling for `#ayah-container` (scrollable).
*   Styling for individual `.ayah-item` divs:
    *   Flexbox/Grid layout for alignment.
    *   `.ayah-number` (circular background).
    *   `.ayah-text` (Arabic font, size, right-to-left).
    *   `.play-button` (icon/button styling).
*   Basic styling for the `#audio-player`.

**6. `popup.js` (Core Logic):**

*   **Constants:** API base URL.
*   **DOM Element References:** Get references to all interactive elements.
*   **State Variables:** `allSurahs`, `allReciters`, `selectedSurahNumber`, `selectedReciterIdentifier`, `currentAyahs`.
*   **API Fetch Functions (async/await):**
    *   `fetchSurahs()`: GET `/v1/surah`. Store result in `allSurahs`. Call `renderSurahList`.
    *   `fetchReciters()`: GET `/v1/edition/format/audio`. Store result in `allReciters`. Call `renderReciterOptions`. *Note: Add comment about potential API key need for extensive edition lists.*
    *   `fetchAyahs(surahNumber, reciterIdentifier)`: GET `/v1/surah/{surahNumber}/{reciterIdentifier}`. Store result in `currentAyahs`. Call `renderAyahs`.
*   **UI Rendering Functions:**
    *   `renderSurahList(filter = '')`: Clears and populates `#surah-list` based on `allSurahs` and the filter text. Adds click listeners to each Surah item.
    *   `renderReciterOptions()`: Clears and populates `#reciter-select` based on `allReciters`.
    *   `renderAyahs()`: Clears and populates `#ayah-container` based on `currentAyahs`. Creates `.ayah-item` divs with number, text, and play button. Adds click listeners to play buttons.
*   **Event Handlers:**
    *   Search Input (`input` event): Call `renderSurahList` with the current input value.
    *   Surah List Item (`click` event): Get `surahNumber`, update `selectedSurahNumber`, call `saveState`, call `fetchAyahs`.
    *   Reciter Select (`change` event): Get `reciterIdentifier`, update `selectedReciterIdentifier`, call `saveState`, call `fetchAyahs`.
    *   Play Button (`click` event): Get `audioUrl`, set `audio-player.src`, call `audio-player.play()`. Ensure only one audio plays at a time (pause existing before playing new).
*   **State Management (`chrome.storage.local`):**
    *   `saveState()`: Saves `selectedSurahNumber` and `selectedReciterIdentifier`.
    *   `loadState()`: Retrieves saved state. If found, updates state variables and calls `fetchAyahs` with saved values. Sets default values (e.g., Surah 1, a default reciter) if no state is found.
*   **Initialization Function (`init()`):**
    *   Called when the script loads (`DOMContentLoaded`).
    *   Add event listeners to static elements (search input, reciter select).
    *   Call `fetchSurahs()` and `fetchReciters()`.
    *   Call `loadState()` to load saved preferences or defaults and fetch initial Ayah data.

**7. Workflow Diagram:**

```mermaid
graph TD
    A[Popup Opens] --> B(init());
    B --> C(Add Event Listeners);
    B --> D(Fetch Surahs API);
    B --> E(Fetch Reciters API);
    B --> F(Load State from Storage);

    D --> G(Store Surahs);
    E --> H(Store Reciters);
    H --> I(Render Reciter Select);

    F --> J{State Found?};
    J -- Yes --> K(Set Selected Surah/Reciter from State);
    J -- No --> L(Set Default Surah/Reciter);

    K --> M(Fetch Ayahs API);
    L --> M;
    G --> N(Render Surah List - Initial);

    subgraph "User Interaction"
        direction LR
        P1[Search Input] --> Q1(Filter Surah List);
        Q1 --> R1(Re-render Surah List);
        P2[Select Surah] --> Q2(Update Selected Surah);
        P3[Select Reciter] --> Q3(Update Selected Reciter);
        Q2 --> S(Save State);
        Q3 --> S;
        S --> T(Fetch Ayahs API);
        P4[Click Play Button] --> Q4(Get Audio URL);
        Q4 --> R4(Pause Current Audio);
        R4 --> S4(Play New Audio);
    end

    M --> U(Store Ayahs);
    T --> U;
    U --> V(Render Ayah Container);

    R1 --> N;
```

**8. Next Steps:**

1.  Review this plan. Do you approve of this structure and logic? (Approved)
2.  Would you like me to write this plan into a `PLAN.md` file in the project directory? (Yes)
3.  Once approved, I will request to switch to "Code" mode to implement these files. (Next step)