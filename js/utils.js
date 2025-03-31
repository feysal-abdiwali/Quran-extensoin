// Helper functions for DOM manipulation
export function showElement(element) {
    if (element) {
        element.style.display = element.classList.contains('loading-indicator') ? 'flex' : 'block';
    }
}

export function hideElement(element) {
    if (element) {
        element.style.display = 'none';
    }
}

// Diagnostic functions
export function checkApiConnection(url) {
    return new Promise((resolve, reject) => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
            controller.abort();
            reject(new Error("API request timed out"));
        }, 5000);
        
        fetch(url, { signal: controller.signal })
            .then(response => {
                clearTimeout(timeoutId);
                if (response.ok) {
                    resolve(true);
                } else {
                    reject(new Error(`API returned status: ${response.status}`));
                }
            })
            .catch(error => {
                clearTimeout(timeoutId);
                reject(error);
            });
    });
}

export function logExtensionDiagnostics() {
    console.log("======= Quran Extension Diagnostics =======");
    console.log("Time:", new Date().toISOString());
    console.log("User Agent:", navigator.userAgent);
    
    // Check storage access
    try {
        chrome.storage.local.get(['diagnosticsCheck'], function(result) {
            console.log("Storage access:", result ? "OK" : "Failed");
            chrome.storage.local.set({'diagnosticsCheck': new Date().toISOString()});
        });
    } catch (error) {
        console.error("Storage access error:", error);
    }
    
    // Log manifest permissions
    try {
        chrome.runtime.getManifest().permissions.forEach(permission => {
            console.log("Permission:", permission);
        });
    } catch (error) {
        console.error("Failed to get manifest permissions:", error);
    }
    
    console.log("=========================================");
}

// Ayah processing functions
export function cleanAyahs(ayahs, surahNumber, bismillahPatterns, specialSurahs, specialCaseSurahs, knownFirstAyahs) {
    if (!ayahs || ayahs.length === 0) return [];
    
    // Create a deep copy to avoid modifying the original data
    const cleanedAyahs = JSON.parse(JSON.stringify(ayahs));
    
    // Special case for Surah 1 (Al-Fatiha) - don't remove Bismillah as it's counted as the first ayah
    if (surahNumber === specialSurahs.AL_FATIHA) {
        return cleanedAyahs;
    }
    
    // Special case for Surah 9 (At-Tawbah) - no Bismillah
    if (surahNumber === specialSurahs.AT_TAWBAH) {
        return cleanedAyahs;
    }
    
    // For all other Surahs - remove Bismillah from first ayah if present
    if (cleanedAyahs.length > 0) {
        const firstAyah = cleanedAyahs[0];
        let textChanged = false;
        
        // 1. First try regex patterns
        bismillahPatterns.forEach(pattern => {
            if (pattern.test(firstAyah.text)) {
                firstAyah.text = firstAyah.text.replace(pattern, '').trim();
                textChanged = true;
            }
        });
        
        // 2. If still contains partial Bismillah, try more aggressive approach
        if (!textChanged || (
            firstAyah.text.indexOf('بسم') >= 0 && 
            firstAyah.text.indexOf('الله') >= 0 && 
            firstAyah.text.indexOf('الرحم') >= 0)) {
            
            // 3. If Surah has a known first ayah, use that
            if (knownFirstAyahs[surahNumber]) {
                const knownAyahText = knownFirstAyahs[surahNumber];
                if (firstAyah.text.indexOf(knownAyahText) >= 0) {
                    firstAyah.text = knownAyahText;
                    textChanged = true;
                }
            }
            
            // 4. If still not fixed, try to find and remove Bismillah by splitting text
            if (!textChanged || (
                firstAyah.text.indexOf('بسم') >= 0 && 
                firstAyah.text.indexOf('الله') >= 0)) {
                
                // Split by common Arabic punctuation marks
                const parts = firstAyah.text.split(/[\.،؛\s]/);
                let bismillahEnd = -1;
                
                // Find where the Bismillah ends
                for (let i = 0; i < parts.length; i++) {
                    if (parts[i].indexOf('الرحيم') >= 0 || 
                        parts[i].indexOf('الرحمن') >= 0) {
                        bismillahEnd = i;
                        break;
                    }
                }
                
                // If found, remove everything up to and including this part
                if (bismillahEnd >= 0 && bismillahEnd < parts.length - 1) {
                    firstAyah.text = parts.slice(bismillahEnd + 1).join(' ').trim();
                    textChanged = true;
                }
            }
            
            // 5. Last resort: if text still too long, just take the second half
            if (firstAyah.text.length > 100 && 
                firstAyah.text.indexOf('بسم') >= 0 && 
                firstAyah.text.indexOf('الله') >= 0) {
                
                // Just take the latter half of the text
                const midPoint = Math.floor(firstAyah.text.length / 2);
                firstAyah.text = firstAyah.text.substring(midPoint).trim();
                textChanged = true;
            }
        }
        
        // Empty string check - if we've removed everything
        if (firstAyah.text.trim() === '') {
            firstAyah.text = '(First Ayah)';
            console.error('Warning: First ayah text is empty after Bismillah removal');
        }
    }
    
    // Clean up all ayahs - normalize whitespace
    return cleanedAyahs.map(ayah => {
        return {
            ...ayah,
            text: ayah.text.trim().replace(/\s+/g, ' ')
        };
    });
}

// Find audio URL for a given ayah number
export function findAudioUrlForAyah(ayahNumber, currentAyahs) {
    // Look through the original ayahs to find the matching audio URL
    const originalAyah = currentAyahs.find(a => {
        const aNumber = typeof a.numberInSurah === 'string' ? 
            parseInt(a.numberInSurah.split('-')[0]) : 
            a.numberInSurah;
        
        return aNumber === ayahNumber && a.audio;
    });
    
    return originalAyah ? originalAyah.audio : null;
}

// Chrome storage helpers
export function saveState(data) {
    return chrome.storage.local.set(data);
}

export function loadState(keys) {
    return chrome.storage.local.get(keys);
}
