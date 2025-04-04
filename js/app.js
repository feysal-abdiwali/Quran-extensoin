import * as config from './config.js';
import * as api from './api.js';
import * as ui from './ui.js';
import * as player from './player.js';
import * as utils from './utils.js'; // Import utils module
import { saveState, loadState } from './utils.js';
import * as translations from './translations.js'; // Import translations module

// Main application class
class QuranApp {
    constructor() {
        // Initialize DOM elements
        this.elements = this.initElements();
        
        // Initialize application state
        this.state = {
            allSurahs: [],
            allReciters: [],
            allLanguages: translations.AVAILABLE_LANGUAGES,
            translationsByLanguage: translations.TRANSLATIONS_BY_LANGUAGE,
            selectedSurahNumber: config.DEFAULT_SURAH,
            selectedReciterIdentifier: config.DEFAULT_RECITER,
            selectedLanguageCode: config.DEFAULT_LANGUAGE,
            selectedTranslationIdentifier: config.DEFAULT_TRANSLATION,
            currentAyahs: [],
            currentSurah: null,
            currentlyPlayingAyahIndex: -1,
            isPlayingAll: false
        };
        
        // Initialize the application
        this.init();
    }
    
    // Get all DOM elements
    initElements() {
        return {
            // Navigation elements
            surahSearchInput: document.getElementById('surah-search'),
            surahList: document.getElementById('surah-list'),
            reciterSelect: document.getElementById('reciter-select'),
            languageSelect: document.getElementById('language-select'),
            translationSelect: document.getElementById('translation-select'),
            ayahContainer: document.getElementById('ayah-container'),
            audioPlayer: document.getElementById('audio-player'),
            audioPlayerContainer: document.getElementById('audio-player-container'),
            surahSection: document.getElementById('surah-section'),
            ayahSection: document.getElementById('ayah-section'),
            backButton: document.getElementById('back-button'),
            surahTitle: document.getElementById('surah-title'),
            playAllButton: document.getElementById('play-all-button'),
            
            // New elements for the redesigned UI
            surahNameArabic: document.getElementById('surah-name-arabic'),
            surahSubtitle: document.getElementById('surah-subtitle'),
            verseCount: document.getElementById('verse-count'),
            revelationType: document.getElementById('revelation-type'),
            
            // Loading and error elements
            surahLoading: document.getElementById('surah-loading'),
            surahError: document.getElementById('surah-error'),
            ayahLoading: document.getElementById('ayah-loading'),
            ayahError: document.getElementById('ayah-error'),
            retrySurahBtn: document.getElementById('retry-surah-btn'),
            retryAyahBtn: document.getElementById('retry-ayah-btn')
        };
    }
    
    // Initialize the application
    async init() {
        // Log extension diagnostics
        utils.logExtensionDiagnostics();
        
        // Set up event listeners first to ensure UI is responsive
        this.setupEventListeners();
        
        // Set initial view - show surah list, hide ayah view
        ui.showSurahList(this.elements);
        
        console.log("Quran Extension initializing...");
        
        try {
            // Show loading indicators
            ui.showElement(this.elements.surahLoading);
            
            // First test API connection before attempting to fetch data
            try {
                await utils.checkApiConnection(`${config.API_BASE_URL}/surah/1`);
                console.log("API connection successful");
            } catch (apiError) {
                console.error("API connection test failed:", apiError);
                throw new Error(`API connection failed: ${apiError.message}`);
            }
            
            // Fetch initial data with a timeout for API calls
            const fetchSurahsPromise = this.fetchInitialData();
            const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error("API request timeout")), 10000)
            );
            
            await Promise.race([fetchSurahsPromise, timeoutPromise]);
            
            // Try to load saved state
            await this.loadSavedState();
        } catch (error) {
            console.error("Error initializing extension:", error);
            
            // Ensure error UI is shown
            ui.hideElement(this.elements.surahLoading);
            ui.showElement(this.elements.surahError);
            
            // Add more detailed error message if possible
            if (this.elements.surahError.querySelector('p')) {
                this.elements.surahError.querySelector('p').innerHTML = 
                    `Could not load Surahs. <br><strong>Error: ${error.message || 'API connection failed'}</strong><br>
                     Please check your internet connection or try again later.`;
            }
        }
    }
    
    // Set up all event listeners
    setupEventListeners() {
        // Search input
        this.elements.surahSearchInput.addEventListener('input', () => {
            ui.renderSurahList(
                this.elements, 
                this.state.allSurahs, 
                this.elements.surahSearchInput.value,
                this.handleSurahClick.bind(this)
            );
        });
        
        // Reciter select
        this.elements.reciterSelect.addEventListener('change', this.handleReciterChange.bind(this));
        
        // Language select
        if (this.elements.languageSelect) {
            this.elements.languageSelect.addEventListener('change', this.handleLanguageChange.bind(this));
        }
        
        // Translation select
        if (this.elements.translationSelect) {
            this.elements.translationSelect.addEventListener('change', this.handleTranslationChange.bind(this));
        }
        
        // Back button
        this.elements.backButton.addEventListener('click', () => {
            ui.showSurahList(this.elements);
            player.stopPlayback(this.elements, this.state);
        });
        
        // Retry buttons
        this.elements.retrySurahBtn.addEventListener('click', async () => {
            const surahs = await api.fetchSurahs(this.elements);
            if (surahs.length > 0) {
                this.state.allSurahs = surahs;
                ui.renderSurahList(this.elements, this.state.allSurahs, '', this.handleSurahClick.bind(this));
            }
        });
        
        this.elements.retryAyahBtn.addEventListener('click', async () => {
            this.fetchAyahs(this.state.selectedSurahNumber, this.state.selectedReciterIdentifier);
        });
        
        // Audio player
        player.initPlayer(this.elements, this.state);
    }
    
    // Fetch initial Surahs and Reciters
    async fetchInitialData() {
        try {
            // Fetch surahs
            const surahs = await api.fetchSurahs(this.elements);
            if (surahs.length > 0) {
                this.state.allSurahs = surahs;
                ui.renderSurahList(this.elements, this.state.allSurahs, '', this.handleSurahClick.bind(this));
            } else {
                throw new Error("No surahs returned from API");
            }
            
            // Fetch reciters
            const reciters = await api.fetchReciters();
            if (reciters.length > 0) {
                this.state.allReciters = reciters;
                ui.renderReciterOptions(this.elements, this.state.allReciters, this.state.selectedReciterIdentifier);
            }
            
            // Render language options
            if (this.elements.languageSelect) {
                ui.renderLanguageOptions(
                    this.elements, 
                    this.state.allLanguages, 
                    this.state.selectedLanguageCode
                );
            }
            
            // Render translation options
            if (this.elements.translationSelect) {
                ui.renderTranslationOptions(
                    this.elements, 
                    this.state.translationsByLanguage, 
                    this.state.selectedLanguageCode,
                    this.state.selectedTranslationIdentifier
                );
            }
            
            return true;
        } catch (error) {
            console.error("Error in fetchInitialData:", error);
            throw error;
        }
    }
    
    // Fetch ayahs for a specific surah with a specific reciter
    async fetchAyahs(surahNumber, reciterIdentifier) {
        try {
            ui.showAyahView(this.elements);
            player.stopPlayback(this.elements, this.state);
            
            // Pass both the config module and selected translation
            const { ayahs, surah } = await api.fetchAyahs(
                surahNumber, 
                reciterIdentifier, 
                this.elements, 
                config,
                this.state.selectedTranslationIdentifier
            );
            
            this.state.currentAyahs = ayahs;
            this.state.currentSurah = surah;
            
            ui.renderAyahs(
                this.elements, 
                this.state.currentAyahs, 
                this.state.currentSurah,
                this.handleSingleAyahPlayClick.bind(this)
            );
        } catch (error) {
            console.error('Error in fetchAyahs:', error);
        }
    }
    
    // Load saved state from storage
    async loadSavedState() {
        const result = await loadState() || {};
        
        if (result.selectedSurahNumber) {
            this.state.selectedSurahNumber = result.selectedSurahNumber;
        }
        
        if (result.selectedReciterIdentifier) {
            this.state.selectedReciterIdentifier = result.selectedReciterIdentifier;
        }
        
        if (result.selectedLanguageCode) {
            this.state.selectedLanguageCode = result.selectedLanguageCode;
        }
        
        if (result.selectedTranslationIdentifier) {
            this.state.selectedTranslationIdentifier = result.selectedTranslationIdentifier;
        }
        
        // Update language and translation dropdowns after loading state
        if (this.elements.languageSelect) {
            ui.renderLanguageOptions(
                this.elements, 
                this.state.allLanguages, 
                this.state.selectedLanguageCode
            );
        }
        
        if (this.elements.translationSelect) {
            ui.renderTranslationOptions(
                this.elements, 
                this.state.translationsByLanguage,
                this.state.selectedLanguageCode,
                this.state.selectedTranslationIdentifier
            );
        }
        
        // Fetch ayahs with the loaded or default state
        if (this.state.selectedSurahNumber) {
            await this.fetchAyahs(this.state.selectedSurahNumber, this.state.selectedReciterIdentifier);
        }
    }
    
    // Save state to storage
    saveState() {
        saveState({
            selectedSurahNumber: this.state.selectedSurahNumber,
            selectedReciterIdentifier: this.state.selectedReciterIdentifier,
            selectedLanguageCode: this.state.selectedLanguageCode,
            selectedTranslationIdentifier: this.state.selectedTranslationIdentifier
        });
    }
    
    // Event handlers
    handleSurahClick(event) {
        // Get the li element, which could be the target or one of its parents
        let targetElement = event.target;
        while (targetElement && !targetElement.dataset.surahNumber) {
            targetElement = targetElement.parentElement;
        }
        
        // If we found an element with the surah number, proceed
        if (targetElement && targetElement.dataset.surahNumber) {
            this.state.selectedSurahNumber = targetElement.dataset.surahNumber;
            this.saveState();
            this.fetchAyahs(this.state.selectedSurahNumber, this.state.selectedReciterIdentifier);
        } else {
            console.error('Could not find surah number in clicked element');
        }
    }
    
    handleReciterChange(event) {
        this.state.selectedReciterIdentifier = event.target.value;
        this.saveState();
        if (this.state.currentSurah) {
            this.fetchAyahs(this.state.currentSurah.number, this.state.selectedReciterIdentifier);
        }
    }
    
    handleLanguageChange(event) {
        const newLanguageCode = event.target.value;
        this.state.selectedLanguageCode = newLanguageCode;
        
        // Get the first translation for the selected language
        const availableTranslations = this.state.translationsByLanguage[newLanguageCode] || [];
        if (availableTranslations.length > 0) {
            this.state.selectedTranslationIdentifier = availableTranslations[0].identifier;
        } else {
            // If no translations are available for this language, use the default
            this.state.selectedTranslationIdentifier = config.DEFAULT_TRANSLATION;
        }
        
        // Update the translation dropdown
        ui.renderTranslationOptions(
            this.elements, 
            this.state.translationsByLanguage,
            this.state.selectedLanguageCode,
            this.state.selectedTranslationIdentifier
        );
        
        // Save state and reload ayahs
        this.saveState();
        if (this.state.currentSurah) {
            this.fetchAyahs(this.state.currentSurah.number, this.state.selectedReciterIdentifier);
        }
    }
    
    handleTranslationChange(event) {
        this.state.selectedTranslationIdentifier = event.target.value;
        this.saveState();
        if (this.state.currentSurah) {
            this.fetchAyahs(this.state.currentSurah.number, this.state.selectedReciterIdentifier);
        }
    }
    
    handleSingleAyahPlayClick(event) {
        const index = parseInt(event.target.dataset.index);
        
        // Stop any ongoing playback sequence
        this.state.isPlayingAll = false;
        
        // Play the clicked ayah
        player.playAyah(this.elements, this.state, index);
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        console.log("Creating QuranApp instance");
        
        // Make the app container visible as soon as possible
        setTimeout(() => {
            const fallback = document.getElementById('fallback-content');
            const appContainer = document.getElementById('app-container');
            
            if (fallback && appContainer) {
                fallback.style.display = 'none';
                appContainer.classList.remove('hidden');
                console.log("App container made visible");
            } else {
                console.error("Could not find fallback or app container elements");
            }
        }, 200);
        
        // Initialize the app
        new QuranApp();
    } catch (error) {
        console.error("Critical error initializing QuranApp:", error);
        
        // If there's a critical error, try to show the fallback and error message
        try {
            const errorParagraph = document.createElement('p');
            errorParagraph.className = 'error-message';
            errorParagraph.textContent = `Critical error: ${error.message}`;
            errorParagraph.style.color = '#ff5555';
            errorParagraph.style.marginTop = '20px';
            
            const fallback = document.getElementById('fallback-content');
            if (fallback) {
                fallback.appendChild(errorParagraph);
                fallback.style.display = 'block';
            }
            
            const appContainer = document.getElementById('app-container');
            if (appContainer) {
                appContainer.classList.add('hidden');
            }
        } catch (e) {
            // Last resort error logging
            console.error("Unable to show error message:", e);
        }
    }
});
