// Script to fetch and display available language translations
fetch('https://api.alquran.cloud/v1/edition?format=text&type=translation')
  .then(response => response.json())
  .then(data => {
    const translations = data.data;
    
    // Get unique languages
    const languages = [...new Set(translations.map(t => t.language))];
    console.log('Available languages:', languages);
    
    // List all translations grouped by language
    console.log('\nAvailable translations by language:');
    languages.forEach(lang => {
      console.log(`\n=== ${lang} ===`);
      const langTranslations = translations.filter(t => t.language === lang);
      langTranslations.forEach(t => {
        console.log(`${t.identifier}: ${t.name || t.englishName}`);
      });
    });
  })
  .catch(error => console.error('Error fetching translations:', error));
