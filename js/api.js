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

export async function fetchAyahs(surahNumber, reciterIdentifier, elements, config, translationIdentifier) {
    try {
        // Show loading indicator, hide error if visible
        showElement(elements.ayahLoading);
        hideElement(elements.ayahError);
        
        // Use provided translation identifier or fall back to default
        const translationId = translationIdentifier || config.DEFAULT_TRANSLATION;
        
        // Check if we're using an Arabic edition as translation
        const isArabicEdition = translationId.startsWith('ar.') || 
                               translationId === 'quran-simple' || 
                               translationId === 'quran-uthmani';
        
        // Fetch Arabic text with audio recitation
        const audioResponse = await fetch(`${API_BASE_URL}/surah/${surahNumber}/${reciterIdentifier}`);
        
        // Fetch translation
        const translationResponse = await fetch(`${API_BASE_URL}/surah/${surahNumber}/${translationId}`);
        
        if (!audioResponse.ok) {
            throw new Error(`Failed to fetch ayahs: ${audioResponse.status} ${audioResponse.statusText}`);
        }
        
        if (!translationResponse.ok) {
            throw new Error(`Failed to fetch translation: ${translationResponse.status} ${translationResponse.statusText}`);
        }
        
        const audioData = await audioResponse.json();
        const translationData = await translationResponse.json();
        
        // Combine the Arabic text and translations
        const combinedAyahs = audioData.data.ayahs.map((ayah, index) => {
            // For Arabic editions, we need to handle differently to avoid showing duplicate Arabic text
            return {
                ...ayah,
                translation: isArabicEdition ? 
                    // For Arabic editions, add a note rather than duplicate the text
                    'تفسير: ' + (translationData.data.ayahs[index]?.text || '') :
                    // For other languages, just use the translation text
                    translationData.data.ayahs[index]?.text || ''
            };
        });
        
        // Process the ayahs to ensure proper formatting and remove Bismillah from first ayah
        const processedAyahs = cleanAyahs(
            combinedAyahs, 
            audioData.data.number, 
            config.BISMILLAH_PATTERNS,
            config.SPECIAL_SURAHS,
            config.SPECIAL_CASE_SURAHS,
            config.KNOWN_FIRST_AYAHS
        );
        
        // Hide loading indicator
        hideElement(elements.ayahLoading);
        
        return {
            ayahs: processedAyahs,
            surah: audioData.data
        };
    } catch (error) {
        console.error('Error fetching ayahs:', error);
        // Hide loading indicator and show error message
        hideElement(elements.ayahLoading);
        showElement(elements.ayahError);
        return { ayahs: [], surah: null };
    }
}
