// Translation configuration file

// Available languages for translation
export const AVAILABLE_LANGUAGES = [
    { code: 'en', name: 'English' },
    { code: 'ar', name: 'Arabic' },
    { code: 'fr', name: 'French' },
    { code: 'es', name: 'Spanish' },
    { code: 'de', name: 'German' },
    { code: 'tr', name: 'Turkish' },
    { code: 'ur', name: 'Urdu' },
    { code: 'ru', name: 'Russian' },
    { code: 'fa', name: 'Persian' },
    { code: 'id', name: 'Indonesian' },
    { code: 'zh', name: 'Chinese' },
    { code: 'hi', name: 'Hindi' },
    { code: 'bn', name: 'Bengali' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' }
];

// Available translations by language
export const TRANSLATIONS_BY_LANGUAGE = {
    en: [
        { identifier: 'en.sahih', name: 'Sahih International' },
        { identifier: 'en.pickthall', name: 'Pickthall' },
        { identifier: 'en.yusufali', name: 'Yusuf Ali' },
        { identifier: 'en.asad', name: 'Muhammad Asad' },
        { identifier: 'en.ahmedali', name: 'Ahmed Ali' },
        { identifier: 'en.arberry', name: 'Arberry' },
        { identifier: 'en.maududi', name: 'Maududi' },
        { identifier: 'en.itani', name: 'Clear Quran (Talal Itani)' }
    ],
    ar: [
        { identifier: 'ar.muyassar', name: 'King Fahad Quran Complex' },
        { identifier: 'quran-simple', name: 'Simple Arabic' },
        { identifier: 'quran-uthmani', name: 'Uthmani Script' }
    ],
    fr: [
        { identifier: 'fr.hamidullah', name: 'Hamidullah' }
    ],
    es: [
        { identifier: 'es.cortes', name: 'Cortes' },
        { identifier: 'es.asad', name: 'Asad' }
    ],
    de: [
        { identifier: 'de.aburida', name: 'Abu Rida' },
        { identifier: 'de.bubenheim', name: 'Bubenheim & Elyas' }
    ],
    tr: [
        { identifier: 'tr.diyanet', name: 'Diyanet İşleri' },
        { identifier: 'tr.yazir', name: 'Elmalılı Hamdi Yazır' }
    ],
    ur: [
        { identifier: 'ur.jalandhry', name: 'Jalandhry' },
        { identifier: 'ur.maududi', name: 'Maududi' }
    ],
    ru: [
        { identifier: 'ru.kuliev', name: 'Kuliev' },
        { identifier: 'ru.osmanov', name: 'Osmanov' }
    ],
    fa: [
        { identifier: 'fa.makarem', name: 'Makarem Shirazi' },
        { identifier: 'fa.ansarian', name: 'Ansarian' }
    ],
    id: [
        { identifier: 'id.indonesian', name: 'Bahasa Indonesia' },
        { identifier: 'id.muntakhab', name: 'Quraish Shihab' }
    ],
    zh: [
        { identifier: 'zh.jian', name: 'Ma Jian' }
    ],
    hi: [
        { identifier: 'hi.hindi', name: 'Farooq Khan & Nadwi' }
    ],
    bn: [
        { identifier: 'bn.bengali', name: 'Muhiuddin Khan' }
    ],
    pt: [
        { identifier: 'pt.elhayek', name: 'El-Hayek' }
    ],
    ja: [
        { identifier: 'ja.japanese', name: 'Japanese' }
    ],
    ko: [
        { identifier: 'ko.korean', name: 'Korean' }
    ]
};

// Get all translations as a flat array
export function getAllTranslations() {
    let allTranslations = [];
    for (const lang in TRANSLATIONS_BY_LANGUAGE) {
        allTranslations = [...allTranslations, ...TRANSLATIONS_BY_LANGUAGE[lang]];
    }
    return allTranslations;
}

// Get translations for a specific language
export function getTranslationsForLanguage(languageCode) {
    return TRANSLATIONS_BY_LANGUAGE[languageCode] || [];
}

// Get language name from code
export function getLanguageName(languageCode) {
    const language = AVAILABLE_LANGUAGES.find(lang => lang.code === languageCode);
    return language ? language.name : languageCode;
}

// Get language code from translation identifier
export function getLanguageCodeFromIdentifier(identifier) {
    if (!identifier) return 'en';
    
    // Most translation identifiers are formatted as 'language.name'
    const parts = identifier.split('.');
    return parts.length > 1 ? parts[0] : 'en';
}
