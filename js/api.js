import { API_BASE_URL } from './config.js';
import { showElement, hideElement, cleanAyahs } from './utils.js';

// API functions for fetching Quran data
export async function fetchSurahs(elements) {
    try {
        // Show loading indicator, hide error if visible
        showElement(elements.surahLoading);
        hideElement(elements.surahError);
        
        const response = await fetch(`${API_BASE_URL}/surah`);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch surahs: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Hide loading indicator
        hideElement(elements.surahLoading);
        
        return data.data;
    } catch (error) {
        console.error('Error fetching surahs:', error);
        // Hide loading indicator and show error message
        hideElement(elements.surahLoading);
        showElement(elements.surahError);
        return [];
    }
}

export async function fetchReciters() {
    try {
        const response = await fetch(`${API_BASE_URL}/edition/format/audio`);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch reciters: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        return data.data.filter(reciter => reciter.format === 'audio' && reciter.type === 'versebyverse');
    } catch (error) {
        console.error('Error fetching reciters:', error);
        // We don't show a separate error for reciters, but log it
        return [];
    }
}

export async function fetchAyahs(surahNumber, reciterIdentifier, elements, config) {
    try {
        // Show loading indicator, hide error if visible
        showElement(elements.ayahLoading);
        hideElement(elements.ayahError);
        
        const response = await fetch(`${API_BASE_URL}/surah/${surahNumber}/${reciterIdentifier}`);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch ayahs: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Process the ayahs to ensure proper formatting and remove Bismillah from first ayah
        const processedAyahs = cleanAyahs(
            data.data.ayahs, 
            data.data.number, 
            config.BISMILLAH_PATTERNS,
            config.SPECIAL_SURAHS,
            config.SPECIAL_CASE_SURAHS,
            config.KNOWN_FIRST_AYAHS
        );
        
        // Hide loading indicator
        hideElement(elements.ayahLoading);
        
        return {
            ayahs: processedAyahs,
            surah: data.data
        };
    } catch (error) {
        console.error('Error fetching ayahs:', error);
        // Hide loading indicator and show error message
        hideElement(elements.ayahLoading);
        showElement(elements.ayahError);
        return { ayahs: [], surah: null };
    }
}
