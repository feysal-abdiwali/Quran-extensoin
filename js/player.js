import { updatePlayingAyahUI } from './ui.js';
import { findAudioUrlForAyah } from './utils.js';

// Audio player state management
export function initPlayer(elements, state) {
    // Play/pause control for play all button
    elements.playAllButton.addEventListener('click', () => {
        if (state.isPlayingAll) {
            pausePlayback(elements, state);
        } else {
            // Check if we're resuming from a paused state
            if (elements.audioPlayer.src && state.currentlyPlayingAyahIndex >= 0) {
                resumePlayback(elements, state);
            } else {
                // Start playing all ayahs from the beginning
                playAllAyahs(elements, state);
            }
        }
    });
    
    // Handle audio ended event to play next ayah
    elements.audioPlayer.addEventListener('ended', () => {
        if (state.isPlayingAll) {
            playNextAyah(elements, state);
        }
    });
}

// Stop playback completely
export function stopPlayback(elements, state) {
    elements.audioPlayer.pause();
    elements.audioPlayer.src = '';
    state.isPlayingAll = false;
    state.currentlyPlayingAyahIndex = -1;
    
    // Reset play all button
    elements.playAllButton.innerHTML = '<span class="play-icon">▶</span> Play Entire Surah';
    elements.playAllButton.classList.remove('playing');
    
    // Remove playing class from all ayah items
    const allAyahItems = document.querySelectorAll('.ayah-item');
    allAyahItems.forEach(item => {
        item.classList.remove('playing');
    });
}

// Play a specific ayah by index
export function playAyah(elements, state, index) {
    if (index >= 0 && index < state.currentAyahs.length) {
        const ayah = state.currentAyahs[index];
        
        // For split ayahs, we need to use the original audio URL
        // Extract the base ayah number without any letter suffix
        let ayahNumber = ayah.numberInSurah;
        if (typeof ayahNumber === 'string' && (ayahNumber.includes('-A') || ayahNumber.includes('-B') || ayahNumber.includes('-'))) {
            // Extract just the number part
            ayahNumber = parseInt(ayahNumber.split('-')[0]);
        }
        
        // Find the corresponding original ayah with the audio URL
        const audioUrl = ayah.audio || findAudioUrlForAyah(ayahNumber, state.currentAyahs);
        
        if (audioUrl) {
            // Set currentlyPlayingAyahIndex before setting src to ensure state is updated
            // even if there's an error loading the audio
            state.currentlyPlayingAyahIndex = index;
            
            // Update UI to show which ayah is playing before audio starts
            updatePlayingAyahUI(elements, index);
            
            // Set audio source and play with better error handling
            try {
                elements.audioPlayer.src = audioUrl;
                
                // Add a promise to handle playback
                const playPromise = elements.audioPlayer.play();
                
                // Handle potential play() promise rejection (happens in some browsers)
                if (playPromise !== undefined) {
                    playPromise.catch(error => {
                        console.error('Error playing audio:', error);
                        // If we can't play this ayah, try the next one if in "play all" mode
                        if (state.isPlayingAll) {
                            setTimeout(() => playNextAyah(elements, state), 500);
                        }
                    });
                }
            } catch (error) {
                console.error('Error setting audio source:', error, audioUrl);
                // Try to play next ayah if this one fails and we're in "play all" mode
                if (state.isPlayingAll) {
                    setTimeout(() => playNextAyah(elements, state), 500);
                } else {
                    stopPlayback(elements, state);
                }
            }
        } else {
            console.error('No audio URL found for ayah:', ayah);
            // Try to play next ayah if this one fails
            if (state.isPlayingAll) {
                setTimeout(() => playNextAyah(elements, state), 500);
            } else {
                stopPlayback(elements, state);
            }
        }
    } else {
        stopPlayback(elements, state);
    }
}

// Play all ayahs sequentially
export function playAllAyahs(elements, state) {
    // Reset if already playing
    stopPlayback(elements, state);
    
    // Start playing from the beginning
    state.isPlayingAll = true;
    playAyah(elements, state, 0);
    
    // Update button text
    elements.playAllButton.innerHTML = '<span class="play-icon">⏸</span> Pause';
    elements.playAllButton.classList.add('playing');
}

// Pause current playback
export function pausePlayback(elements, state) {
    // Pause playback
    elements.audioPlayer.pause();
    // Don't reset the src to maintain the current position
    state.isPlayingAll = false;
    
    // Update button text
    elements.playAllButton.innerHTML = '<span class="play-icon">▶</span> Resume';
    elements.playAllButton.classList.remove('playing');
}

// Resume paused playback
export function resumePlayback(elements, state) {
    // Only resume if there's a valid source and we were playing an ayah
    if (elements.audioPlayer.src && state.currentlyPlayingAyahIndex >= 0) {
        // Resume playback from current position
        const playPromise = elements.audioPlayer.play();
        
        // Handle potential play() promise rejection
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.error('Error resuming audio:', error);
                // If resuming fails, try to restart the current ayah
                playAyah(elements, state, state.currentlyPlayingAyahIndex);
            });
        }
        
        state.isPlayingAll = true;
        
        // Update button text
        elements.playAllButton.innerHTML = '<span class="play-icon">⏸</span> Pause';
        elements.playAllButton.classList.add('playing');
    } else {
        // If there's no valid audio source or no current ayah, restart playback
        if (state.currentAyahs && state.currentAyahs.length > 0) {
            playAllAyahs(elements, state);
        }
    }
}

// Play the next ayah in sequence
export function playNextAyah(elements, state) {
    // Move to the next ayah
    const nextIndex = state.currentlyPlayingAyahIndex + 1;
    
    if (nextIndex < state.currentAyahs.length) {
        // Add a small delay between ayahs for better user experience
        setTimeout(() => {
            // Play the next ayah
            playAyah(elements, state, nextIndex);
        }, 300);
    } else {
        // Reached the end of the surah
        stopPlayback(elements, state);
    }
}
