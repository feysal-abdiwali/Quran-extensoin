# Quran Extension

A Chrome browser extension that provides easy access to Quranic text and audio recitations directly from your browser's sidebar.

![Quran Extension](icons/icon128.png)

## ⚠️ Maintenance Notice

**This repository is currently unmaintained.** I encourage users to fork this repository and continue development if they find it useful. The Quran deserves continuous improvement and care, so please consider becoming a maintainer by forking this project and making it your own.

## Features

- 📖 Browse and read all 114 Surahs of the Quran
- 🔊 Listen to audio recitations from multiple reciters
- 📱 Responsive design that works across different screen sizes
- 🧩 Convenient sidebar integration for easy access while browsing
- ⚡ Fast and lightweight with minimal resource usage
- 🌙 Proper handling of Bismillah for all Surahs
- 🔍 Simple and intuitive navigation

## Installation

### From Chrome Web Store

1. Visit the [Quran Extension on Chrome Web Store](#) (link to be added)
2. Click "Add to Chrome"
3. The extension will be installed and available in your sidebar

### Developer Installation

1. **Fork this repository** (highly recommended as this repo is unmaintained)
2. Clone your fork:
   ```
   git clone https://github.com/your-username/quran-extension.git
   ```
3. Open Chrome and navigate to `chrome://extensions/`
4. Enable "Developer mode" (toggle in the top right)
5. Click "Load unpacked" and select the extension directory
6. The extension will appear in your extensions list and sidebar

## Usage

1. Click the extension icon in your Chrome toolbar or access it from the sidebar
2. Browse the list of Surahs or use the search feature
3. Click on any Surah to view its Ayahs
4. Use the audio controls to listen to recitations
5. Select different reciters from the dropdown menu

## API Information

This extension uses the [Alquran Cloud API](https://alquran.cloud/api) to fetch Quranic text and audio recitations.

## Privacy Policy

This extension does not collect, store, or transmit any personal user data.

The extension stores user preferences (such as selected reciter and last viewed Surah) locally in your browser using Chrome's storage API. This data remains on your device and is not shared with any external servers or third parties.

The extension fetches Quranic text and audio from api.alquran.cloud, but does not transmit any user information to this service.

## License

This project is licensed under the MIT License with an additional condition:

- You are free to use, modify, and distribute this software provided that any derivative works are used in a manner that respects the Quran and Islamic values.

Please note that by using this software, you agree to these terms. If you plan to use this software for any purpose, please ensure that your use complies with the license conditions.

See the [LICENSE](LICENSE) file for the full license text.

## Contributing

Contributions are welcome! If you'd like to contribute to this project, please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature-name`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some feature'`)
5. Push to the branch (`git push origin feature/your-feature-name`)
6. Open a Pull Request

Please ensure your code follows the existing style and respects the purpose of this extension.

## Special Handling

The extension includes special handling for:
- Surah 1 (Al-Fatiha) where Bismillah is counted as the first ayah
- Surah 9 (At-Tawbah) which doesn't begin with Bismillah
- Proper display of Arabic text and diacritics

## Acknowledgements

- [Alquran Cloud](https://alquran.cloud/) for providing the Quran API
- All contributors who have helped improve this extension
- The Muslim community for feedback and support

## Contact

**Note:** I am unable to provide support or respond to questions due to time constraints. As mentioned above, this repository is unmaintained. If you encounter issues or want to improve the extension, please fork the repository and continue development on your own fork.

---

*This extension is created with the intention of making the Quran more accessible. May Allah accept this work and make it beneficial for all.*
