import { SPECIAL_SURAHS } from './config.js';
import { showElement, hideElement } from './utils.js';

// Re-export the utility functions for DOM manipulation
export { showElement, hideElement };

// View management functions
export function showSurahList(elements) {
    showElement(elements.surahSection);
    hideElement(elements.ayahSection);
    
    // Hide audio player container
    if (elements.audioPlayerContainer) {
        hideElement(elements.audioPlayerContainer);
    }
    hideElement(elements.audioPlayer);
}

export function showAyahView(elements) {
    hideElement(elements.surahSection);
    showElement(elements.ayahSection);
    
    // Show audio player container
    if (elements.audioPlayerContainer) {
        showElement(elements.audioPlayerContainer);
    }
    showElement(elements.audioPlayer);
}

// Rendering functions
export function renderSurahList(elements, allSurahs, filter = '', clickHandler) {
    elements.surahList.innerHTML = '';
    
    if (allSurahs.length === 0) {
        // If we have no surahs, don't render anything
        return;
    }
    
    const filteredSurahs = allSurahs.filter(surah => 
        surah.englishName.toLowerCase().includes(filter.toLowerCase()) ||
        surah.name.toLowerCase().includes(filter.toLowerCase())
    );
    
    if (filteredSurahs.length === 0) {
        // No search results
        const noResults = document.createElement('li');
        noResults.className = 'no-results';
        noResults.textContent = 'No surahs found matching your search';
        elements.surahList.appendChild(noResults);
        return;
    }
    
    filteredSurahs.forEach(surah => {
        const li = document.createElement('li');
        li.dataset.surahNumber = surah.number;
        li.addEventListener('click', clickHandler);
        
        // Create Surah Number element
        const numberDiv = document.createElement('div');
        numberDiv.className = 'surah-item-number';
        numberDiv.textContent = surah.number;
        
        // Create Info container
        const infoDiv = document.createElement('div');
        infoDiv.className = 'surah-item-info';
        
        // English Name
        const nameEnDiv = document.createElement('div');
        nameEnDiv.className = 'surah-item-name-en';
        nameEnDiv.textContent = surah.englishName;
        
        // English Translation
        const translationDiv = document.createElement('div');
        translationDiv.className = 'surah-item-translation';
        translationDiv.textContent = surah.englishNameTranslation || '';
        
        // Metadata (Verse Count, Revelation Type)
        const metaDiv = document.createElement('div');
        metaDiv.className = 'surah-item-meta';
        metaDiv.textContent = `${surah.revelationType || ''} • ${surah.numberOfAyahs} Verses`;
        
        // Append info elements
        infoDiv.appendChild(nameEnDiv);
        infoDiv.appendChild(translationDiv);
        infoDiv.appendChild(metaDiv);
        
        // Create Arabic Name element
        const nameArDiv = document.createElement('div');
        nameArDiv.className = 'surah-item-name-ar';
        nameArDiv.textContent = surah.name;
        
        // Assemble the list item
        li.appendChild(numberDiv);
        li.appendChild(infoDiv);
        li.appendChild(nameArDiv);
        
        elements.surahList.appendChild(li);
    });
}

export function renderReciterOptions(elements, allReciters, selectedReciterIdentifier) {
    elements.reciterSelect.innerHTML = '';
    
    allReciters.forEach(reciter => {
        const option = document.createElement('option');
        option.value = reciter.identifier;
        option.textContent = reciter.englishName || reciter.name;
        if (reciter.identifier === selectedReciterIdentifier) {
            option.selected = true;
        }
        elements.reciterSelect.appendChild(option);
    });
}

export function renderLanguageOptions(elements, availableLanguages, selectedLanguageCode) {
    if (!elements.languageSelect) return;
    
    elements.languageSelect.innerHTML = '';
    
    availableLanguages.forEach(language => {
        const option = document.createElement('option');
        option.value = language.code;
        option.textContent = language.name;
        if (language.code === selectedLanguageCode) {
            option.selected = true;
        }
        elements.languageSelect.appendChild(option);
    });
}

export function renderTranslationOptions(elements, translationsByLanguage, selectedLanguageCode, selectedTranslationIdentifier) {
    if (!elements.translationSelect) return;
    
    elements.translationSelect.innerHTML = '';
    
    // Get translations for the selected language
    const translations = translationsByLanguage[selectedLanguageCode] || [];
    
    translations.forEach(translation => {
        const option = document.createElement('option');
        option.value = translation.identifier;
        option.textContent = translation.name;
        if (translation.identifier === selectedTranslationIdentifier) {
            option.selected = true;
        }
        elements.translationSelect.appendChild(option);
    });
    
    // If there are no translations available for this language or the dropdown is empty
    if (translations.length === 0) {
        const option = document.createElement('option');
        option.value = '';
        option.textContent = 'No translations available';
        option.disabled = true;
        option.selected = true;
        elements.translationSelect.appendChild(option);
    }
}

export function renderAyahs(elements, currentAyahs, currentSurah, playClickHandler) {
    elements.ayahContainer.innerHTML = '';
    
    // Set the surah information in the info card
    if (currentSurah) {
        // Update surah title and subtitle
        elements.surahTitle.textContent = currentSurah.englishName;
        
        // Set Arabic name if available
        if (elements.surahNameArabic) {
            elements.surahNameArabic.textContent = currentSurah.name;
        }
        
        // Set subtitle (The Opening, The Cow, etc.)
        if (elements.surahSubtitle) {
            elements.surahSubtitle.textContent = currentSurah.englishNameTranslation || '';
        }
        
        // Update verse count
        if (elements.verseCount) {
            elements.verseCount.textContent = `${currentSurah.numberOfAyahs} verses`;
        }
        
        // Update revelation type (Meccan/Medinan)
        if (elements.revelationType) {
            elements.revelationType.textContent = currentSurah.revelationType || '';
        }
    }
    
    // We'll rely on the API-provided Bismillah instead of adding our own header
    
    currentAyahs.forEach((ayah, index) => {
        // Create ayah container
        const ayahItem = document.createElement('div');
        ayahItem.className = 'ayah-item';
        ayahItem.dataset.index = index;
        
        // Create ayah number
        const ayahNumber = document.createElement('div');
        ayahNumber.className = 'ayah-number';
        ayahNumber.textContent = ayah.numberInSurah;
        
        // Create ayah text
        const ayahText = document.createElement('div');
        ayahText.className = 'ayah-text';
        
        // Special formatting for Bismillah in first ayah
        if (index === 0 && ayah.text.includes('بسم الله') || ayah.text.includes('بِسْمِ اللَّهِ')) {
            // Create special Bismillah container to match our previous styling
            const bismillahSpan = document.createElement('div');
            bismillahSpan.className = 'bismillah-text';
            bismillahSpan.textContent = ayah.text;
            ayahText.appendChild(bismillahSpan);
            
            // Add translation if it's a stand-alone Bismillah (typically in first ayah)
            if (ayah.text.length < 50) {
                const bismillahTranslation = document.createElement('div');
                bismillahTranslation.className = 'translation-text';
                bismillahTranslation.textContent = 'In the name of Allah, the Entirely Merciful, the Especially Merciful';
                ayahText.appendChild(bismillahTranslation);
            } else if (ayah.translation) {
                // Otherwise use the provided translation
                const translationText = document.createElement('div');
                translationText.className = 'translation-text';
                translationText.textContent = ayah.translation;
                ayahText.appendChild(translationText);
            }
        } else {
            // Regular ayah text
            ayahText.textContent = ayah.text;
            
            // Add translation if available
            if (ayah.translation) {
                const translationText = document.createElement('div');
                translationText.className = 'translation-text';
                translationText.textContent = ayah.translation;
                ayahText.appendChild(translationText);
            }
        }
        
        // Create play button
        const playButton = document.createElement('button');
        playButton.className = 'play-button';
        playButton.innerHTML = '▶';
        playButton.dataset.audioUrl = ayah.audio;
        playButton.dataset.index = index;
        playButton.addEventListener('click', playClickHandler);
        
        // Assemble the ayah item
        ayahItem.appendChild(ayahNumber);
        ayahItem.appendChild(ayahText);
        ayahItem.appendChild(playButton);
        
        // Add to container
        elements.ayahContainer.appendChild(ayahItem);
    });
}

export function updatePlayingAyahUI(elements, index) {
    // Remove playing class from all ayah items
    const allAyahItems = document.querySelectorAll('.ayah-item');
    allAyahItems.forEach(item => {
        item.classList.remove('playing');
    });
    
    // Add playing class to current ayah
    if (index >= 0 && index < allAyahItems.length) {
        allAyahItems[index].classList.add('playing');
        
        // Scroll to the playing ayah
        allAyahItems[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}
