// Configuration constants
export const API_BASE_URL = 'https://api.alquran.cloud/v1';

// Default settings
export const DEFAULT_SURAH = 1; // Default to Surah Al-Fatiha
export const DEFAULT_RECITER = 'ar.alafasy'; // Default reciter

// Bismillah patterns for text processing
export const BISMILLAH_PATTERNS = [
    /بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ/,
    /بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ/,
    /بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ/,
    /﻿بِسۡمِ ٱللَّهِ ٱلرَّحۡمَـٰنِ ٱلرَّحِيمِ/,
    /بسم الله الرحمن الرحيم/,
    /بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ/,
    /بِّسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ/,
    /بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ/,
    /بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ/,
    /بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ/,
    /بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ/,
    /بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ/,
    /بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ/,
    /بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ/,
    /بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ/,
    /بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ/,
    /بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ/,
    /بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ/,
    /بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ/,
    /بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ/,
];

// Special Surah identification
export const SPECIAL_SURAHS = {
    AL_FATIHA: 1,  // Bismillah is part of the first ayah
    AT_TAWBAH: 9,  // No Bismillah
};

// Special case surah numbers that need extra processing
export const SPECIAL_CASE_SURAHS = [90, 95, 103];

// Known first ayah text for specific surahs
export const KNOWN_FIRST_AYAHS = {
    90: "لَا أُقْسِمُ بِهَٰذَا الْبَلَدِ" // Al-Balad
};
