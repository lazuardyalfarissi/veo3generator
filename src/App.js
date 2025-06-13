import React, { useState, useEffect } from 'react';

// Main App component for the Veo 3 Prompt Generator
function App() {
  // State variables for each input field
  const [subject, setSubject] = useState(''); // Who/What
  const [action, setAction] = useState(''); // What is happening
  const [expression, setExpression] = useState(''); // Emotion
  const [place, setPlace] = useState(''); // Background/Location
  const [time, setTime] = useState(''); // Time of day (dropdown)
  const [cameraAngle, setCameraAngle] = useState(''); // Camera angle
  const [cameraMovement, setCameraMovement] = useState(''); // Camera movement
  const [lighting, setLighting] = useState(''); // Lighting
  const [videoStyle, setVideoStyle] = useState(''); // Video style
  const [backsound, setBacksound] = useState(''); // Background sound
  const [spokenWords, setSpokenWords] = useState(''); // Spoken words
  const [additionalDetails, setAdditionalDetails] = useState(''); // Additional details

  // New state variables for expanded features
  const [subjectAge, setSubjectAge] = useState('');
  const [subjectGender, setSubjectGender] = useState('');
  const [subjectAttire, setSubjectAttire] = useState('');
  const [subjectAccessories, setSubjectAccessories] = useState('');
  const [subjectAppearance, setSubjectAppearance] = useState(''); // New: Appearance details
  const [characterArchetype, setCharacterArchetype] = useState(''); // New: Character role

  const [interactionType, setInteractionType] = useState(''); // New: Type of interaction
  const [paceOfAction, setPaceOfAction] = useState(''); // New: Speed of action

  const [weather, setWeather] = useState('');
  const [timeOfDayDetail, setTimeOfDayDetail] = useState('');
  const [colorPalette, setColorPalette] = useState('');
  const [props, setProps] = useState('');
  const [eraSetting, setEraSetting] = useState(''); // New: Historical era
  const [specificLocationDetails, setSpecificLocationDetails] = useState(''); // New: Very specific place details
  const [moodAtmosphere, setMoodAtmosphere] = useState(''); // New: Emotional tone of environment

  const [aspectRatio, setAspectRatio] = useState('');
  const [resolution, setResolution] = useState('');
  const [duration, setDuration] = useState('');
  const [visualEffects, setVisualEffects] = useState('');
  const [lensType, setLensType] = useState(''); // New: Lens type
  const [focusTechnique, setFocusTechnique] = useState(''); // New: Focus style
  const [shotType, setShotType] = useState(''); // New: Camera shot type

  const [soundEffects, setSoundEffects] = useState('');
  const [musicGenre, setMusicGenre] = useState('');
  const [dialogueSnippet, setDialogueSnippet] = useState('');
  const [voiceOver, setVoiceOver] = useState(''); // New: Voice over details
  const [soundScape, setSoundScape] = useState(''); // New: Overall sound environment

  const [genre, setGenre] = useState(''); // New: Video genre
  const [targetAudience, setTargetAudience] = useState(''); // New: Intended audience
  const [messageTheme, setMessageTheme] = useState(''); // New: Underlying message/theme

  // State variables for the generated prompts
  const [promptId, setPromptId] = useState(''); // Indonesian prompt
  const [promptEn, setPromptEn] = useState(''); // English prompt

  // New state variables for image description feature
  const [uploadedImage, setUploadedImage] = useState(null); // File object for display
  const [base64Image, setBase64Image] = useState(''); // Base64 string for LLM
  const [isDescribingImage, setIsDescribingImage] = useState(false); // Loading indicator for general description
  const [subjectDescriptionLoading, setSubjectDescriptionLoading] = useState(false); // Loading indicator for subject description
  const [placeDescriptionLoading, setPlaceDescriptionLoading] = useState(false); // Loading indicator for place description
  const [imageDescriptionError, setImageDescriptionError] = useState(''); // Error message for image description
  const [subjectError, setSubjectError] = useState(''); // Error message for subject description
  const [placeError, setPlaceError] = useState(''); // Error message for place description

  // Dark Mode State
  const [darkMode, setDarkMode] = useState(false);

  // Effect to set dark mode from local storage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
    } else if (savedTheme === 'light') {
      setDarkMode(false);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
  }, []);

  // Effect to update local storage and apply dark mode class to body
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);


  // Function to handle image file selection
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        // Remove the "data:image/png;base64," prefix for the LLM
        setBase64Image(reader.result.split(',')[1]);
      };
      reader.onerror = () => {
        setImageDescriptionError('Gagal membaca gambar. Silakan coba lagi.');
      };
      reader.readAsDataURL(file);
    } else {
      setUploadedImage(null);
      setBase64Image('');
    }
  };

  // Function to describe the image using Gemini API (general description)
  const describeImage = async () => {
    if (!base64Image) {
      setImageDescriptionError('Harap unggah gambar terlebih dahulu.');
      return;
    }

    setIsDescribingImage(true);
    setImageDescriptionError('');

    try {
      // Prompt for general description (subject, action, place, details) in Indonesian
      const prompt = "Deskripsikan subjek utama, aksi mereka, dan latar belakang/tempat di gambar ini. Berikan juga detail tambahan yang penting. Tanggapi dalam objek JSON dengan kunci: 'subject', 'action', 'place', dan 'additional_details'. Pastikan semua deskripsi dalam Bahasa Indonesia.";
      let chatHistory = [];
      chatHistory.push({ role: "user", parts: [{ text: prompt }] });

      const payload = {
        contents: [
          {
            role: "user",
            parts: [
              { text: prompt },
              {
                inlineData: {
                  mimeType: uploadedImage.type, // Use the actual mime type of the uploaded image
                  data: base64Image
                }
              }
            ]
          }
        ],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              subject: { type: "STRING" },
              action: { type: "STRING" },
              place: { type: "STRING" },
              additional_details: { type: "STRING" }
            },
            required: ["subject", "action", "place", "additional_details"]
          }
        }
      };

      const apiKey = "AIzaSyCa0UMtxkzuDf6bWfpFYE2l-_78AyHjMpc"; // Canvas will automatically provide it in runtime
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.candidates && result.candidates.length > 0 &&
          result.candidates[0].content && result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0) {
        const jsonText = result.candidates[0].content.parts[0].text;
        const parsedJson = JSON.parse(jsonText);

        setSubject(parsedJson.subject || '');
        setAction(parsedJson.action || '');
        setPlace(parsedJson.place || '');
        setAdditionalDetails(parsedJson.additional_details || '');

      } else {
        setImageDescriptionError('Gagal mendapatkan deskripsi dari AI. Respon tidak terduga.');
      }
    } catch (error) {
      console.error("Error describing image:", error);
      setImageDescriptionError(`Gagal mendeskripsikan gambar: ${error.message}.`);
    } finally {
      setIsDescribingImage(false);
    }
  };

  // Function to describe the subject in detail (in Indonesian)
  const describeSubjectDetails = async () => {
    if (!base64Image) {
      setSubjectError('Harap unggah gambar terlebih dahulu.');
      return;
    }

    setSubjectDescriptionLoading(true);
    setSubjectError('');

    try {
      const prompt = "Deskripsikan subjek utama yang terlihat di gambar ini secara detail dalam bahasa Indonesia. Berikan deskripsi yang singkat dan fokus pada identitas subjek. Hasil dalam format JSON dengan kunci 'subject_description'.";
      let chatHistory = [];
      chatHistory.push({ role: "user", parts: [{ text: prompt }] });

      const payload = {
        contents: [
          {
            role: "user",
            parts: [
              { text: prompt },
              {
                inlineData: {
                  mimeType: uploadedImage.type,
                  data: base64Image
                }
              }
            ]
          }
        ],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              subject_description: { type: "STRING" }
            },
            required: ["subject_description"]
          }
        }
      };

      const apiKey = "AIzaSyCa0UMtxkzuDf6bWfpFYE2l-_78AyHjMpc";
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.candidates && result.candidates.length > 0 &&
          result.candidates[0].content && result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0) {
        const jsonText = result.candidates[0].content.parts[0].text;
        const parsedJson = JSON.parse(jsonText);
        setSubject(parsedJson.subject_description || '');
      } else {
        setSubjectError('Gagal mendapatkan deskripsi subjek dari AI. Respon tidak terduga.');
      }
    } catch (error) {
      console.error("Error describing subject:", error);
      setSubjectError(`Gagal mendeskripsikan subjek: ${error.message}.`);
    } finally {
      setSubjectDescriptionLoading(false);
    }
  };

  // Function to describe the place in detail (in Indonesian)
  const describePlaceDetails = async () => {
    if (!base64Image) {
      setPlaceError('Harap unggah gambar terlebih dahulu.');
      return;
    }

    setPlaceDescriptionLoading(true);
    setPlaceError('');

    try {
      const prompt = "Deskripsikan latar belakang atau tempat yang terlihat di gambar ini secara detail dalam bahasa Indonesia. Berikan deskripsi yang singkat dan fokus pada lokasi atau lingkungan. Hasil dalam format JSON dengan kunci 'place_description'.";
      let chatHistory = [];
      chatHistory.push({ role: "user", parts: [{ text: prompt }] });

      const payload = {
        contents: [
          {
            role: "user",
            parts: [
              { text: prompt },
              {
                inlineData: {
                  mimeType: uploadedImage.type,
                  data: base64Image
                }
              }
            ]
          }
        ],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              place_description: { type: "STRING" }
            },
            required: ["place_description"]
          }
        }
      };

      const apiKey = "AIzaSyCa0UMtxkzuDf6bWfpFYE2l-_78AyHjMpc";
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.candidates && result.candidates.length > 0 &&
          result.candidates[0].content && result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0) {
        const jsonText = result.candidates[0].content.parts[0].text;
        const parsedJson = JSON.parse(jsonText);
        setPlace(parsedJson.place_description || '');
      } else {
        setPlaceError('Gagal mendapatkan deskripsi tempat dari AI. Respon tidak terduga.');
      }
    } catch (error) {
      console.error("Error describing place:", error);
      setPlaceError(`Gagal mendeskripsikan tempat: ${error.message}.`);
    } finally {
      setPlaceDescriptionLoading(false);
    }
  };

  // Function to generate the prompts based on current state values
  const generatePrompt = () => {
    const buildPromptParts = (lang) => {
      let parts = [];
      const isId = lang === 'id';
      const getTime = (idTime) => {
        const map = {
          'Pagi': 'Morning',
          'Siang': 'Day',
          'Sore': 'Afternoon',
          'Malam': 'Night',
        };
        return isId ? idTime : map[idTime] || idTime;
      };

      // Subject/Character Details
      if (subject) parts.push(`${isId ? 'Subjek' : 'Subject'}: ${subject}`);
      if (subjectAge) parts.push(`${isId ? 'Usia Subjek' : 'Subject Age'}: ${subjectAge}`);
      if (subjectGender) parts.push(`${isId ? 'Jenis Kelamin Subjek' : 'Subject Gender'}: ${subjectGender}`);
      if (subjectAttire) parts.push(`${isId ? 'Pakaian Subjek' : 'Subject Attire'}: ${subjectAttire}`);
      if (subjectAccessories) parts.push(`${isId ? 'Aksesoris Subjek' : 'Subject Accessories'}: ${subjectAccessories}`);
      if (subjectAppearance) parts.push(`${isId ? 'Penampilan Subjek' : 'Subject Appearance'}: ${subjectAppearance}`);
      if (characterArchetype) parts.push(`${isId ? 'Arketipe Karakter' : 'Character Archetype'}: ${characterArchetype}`);

      // Action & Interaction
      if (action) parts.push(`${isId ? 'Aksi' : 'Action'}: ${action}`);
      if (expression) parts.push(`${isId ? 'Ekspresi' : 'Expression'}: ${expression}`);
      if (interactionType) parts.push(`${isId ? 'Jenis Interaksi' : 'Interaction Type'}: ${interactionType}`);
      if (paceOfAction) parts.push(`${isId ? 'Kecepatan Aksi' : 'Pace of Action'}: ${paceOfAction}`);

      // Environment & Atmosphere
      if (place) parts.push(`${isId ? 'Tempat' : 'Place'}: ${place}`);
      if (eraSetting) parts.push(`${isId ? 'Pengaturan Era' : 'Era Setting'}: ${eraSetting}`);
      if (specificLocationDetails) parts.push(`${isId ? 'Detail Lokasi Spesifik' : 'Specific Location Details'}: ${specificLocationDetails}`);
      if (moodAtmosphere) parts.push(`${isId ? 'Suasana/Mood' : 'Mood/Atmosphere'}: ${moodAtmosphere}`);
      if (time) parts.push(`${isId ? 'Waktu (Umum)' : 'Time (General)'}: ${getTime(time)}`);
      if (timeOfDayDetail) parts.push(`${isId ? 'Detail Waktu' : 'Time Detail'}: ${timeOfDayDetail}`);
      if (weather) parts.push(`${isId ? 'Cuaca' : 'Weather'}: ${weather}`);
      if (colorPalette) parts.push(`${isId ? 'Palet Warna' : 'Color Palette'}: ${colorPalette}`);
      if (props) parts.push(`${isId ? 'Properti' : 'Props'}: ${props}`);

      // Camera & Cinematography
      if (cameraAngle) parts.push(`${isId ? 'Sudut Kamera' : 'Camera Angle'}: ${cameraAngle}`);
      if (cameraMovement) parts.push(`${isId ? 'Gerakan Kamera' : 'Camera Movement'}: ${cameraMovement}`);
      if (lensType) parts.push(`${isId ? 'Jenis Lensa' : 'Lens Type'}: ${lensType}`);
      if (focusTechnique) parts.push(`${isId ? 'Teknik Fokus' : 'Focus Technique'}: ${focusTechnique}`);
      if (shotType) parts.push(`${isId ? 'Jenis Shot' : 'Shot Type'}: ${shotType}`);

      // Lighting & Style
      if (lighting) parts.push(`${isId ? 'Pencahayaan' : 'Lighting'}: ${lighting}`);
      if (videoStyle) parts.push(`${isId ? 'Gaya Video' : 'Video Style'}: ${videoStyle}`);

      // Video Production Details
      if (aspectRatio) parts.push(`${isId ? 'Rasio Aspek' : 'Aspect Ratio'}: ${aspectRatio}`);
      if (resolution) parts.push(`${isId ? 'Resolusi' : 'Resolution'}: ${resolution}`);
      if (duration) parts.push(`${isId ? 'Durasi' : 'Duration'}: ${duration}`);
      if (visualEffects) parts.push(`${isId ? 'Efek Visual (VFX)' : 'Visual Effects (VFX)'}: ${visualEffects}`);

      // Audio & Narration
      if (backsound) parts.push(`${isId ? 'Backsound' : 'Backsound'}: ${backsound}`);
      if (musicGenre) parts.push(`${isId ? 'Genre Musik' : 'Music Genre'}: ${musicGenre}`);
      if (soundEffects) parts.push(`${isId ? 'Efek Suara (SFX)' : 'Sound Effects (SFX)'}: ${soundEffects}`);
      if (spokenWords) parts.push(`${isId ? 'Kalimat yang Diucapkan' : 'Spoken Words'}: "${spokenWords}"`);
      if (dialogueSnippet) parts.push(`${isId ? 'Kutipan Dialog' : 'Dialogue Snippet'}: "${dialogueSnippet}"`);
      if (voiceOver) parts.push(`${isId ? 'Narasi/Voice Over' : 'Voice Over'}: ${voiceOver}`);
      if (soundScape) parts.push(`${isId ? 'Lanskap Suara' : 'Soundscape'}: ${soundScape}`);

      // Overall Project Details
      if (genre) parts.push(`${isId ? 'Genre' : 'Genre'}: ${genre}`);
      if (targetAudience) parts.push(`${isId ? 'Target Audiens' : 'Target Audience'}: ${targetAudience}`);
      if (messageTheme) parts.push(`${isId ? 'Pesan/Tema' : 'Message/Theme'}: ${messageTheme}`);

      // Additional Details
      if (additionalDetails) parts.push(`${isId ? 'Detail Tambahan' : 'Additional Details'}: ${additionalDetails}`);

      return parts.join(', ');
    };

    setPromptId(buildPromptParts('id'));
    setPromptEn(buildPromptParts('en'));
  };

  // Function to copy text to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      // Optional: Add a visual feedback for successful copy, e.g., a toast notification
      console.log('Text copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy text: ', err);
      // Fallback for older browsers or if navigator.clipboard not available in iframe
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        console.log('Text copied using execCommand');
      } catch (err) {
        console.error('Failed to copy text using execCommand: ', err);
      }
      document.body.removeChild(textarea);
    });
  };

  // Function to reset all form fields
  const resetForm = () => {
    setSubject('');
    setAction('');
    setExpression('');
    setPlace('');
    setTime('');
    setCameraAngle('');
    setCameraMovement('');
    setLighting('');
    setVideoStyle('');
    setBacksound('');
    setSpokenWords('');
    setAdditionalDetails('');

    // Reset new fields
    setSubjectAge('');
    setSubjectGender('');
    setSubjectAttire('');
    setSubjectAccessories('');
    setSubjectAppearance('');
    setCharacterArchetype('');
    setInteractionType('');
    setPaceOfAction('');
    setWeather('');
    setTimeOfDayDetail('');
    setColorPalette('');
    setProps('');
    setEraSetting('');
    setSpecificLocationDetails('');
    setMoodAtmosphere('');
    setLensType('');
    setFocusTechnique('');
    setShotType('');
    setAspectRatio('');
    setResolution('');
    setDuration('');
    setVisualEffects('');
    setSoundEffects('');
    setMusicGenre('');
    setDialogueSnippet('');
    setVoiceOver('');
    setSoundScape('');
    setGenre('');
    setTargetAudience('');
    setMessageTheme('');

    setPromptId('');
    setPromptEn('');
    setUploadedImage(null);
    setBase64Image('');
    setImageDescriptionError('');
    setIsDescribingImage(false);
    setSubjectDescriptionLoading(false);
    setPlaceDescriptionLoading(false);
    setSubjectError('');
    setPlaceError('');
  };

  // Function to open Gemini in a new tab
  const openGemini = () => {
    window.open('https://gemini.google.com/', '_blank');
  };


  return (
    // Main container with responsive styling and dark mode conditional classes
    <div className={`min-h-screen p-4 sm:p-8 flex items-center justify-center font-sans transition-colors duration-300
      ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-900'}`}>
      <div className={`p-6 sm:p-10 rounded-xl shadow-2xl w-full max-w-4xl border transition-colors duration-300
        ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-blue-200'}`}>
        <h1 className={`text-3xl sm:text-4xl font-extrabold text-center mb-6 sm:mb-10 tracking-tight transition-colors duration-300
          ${darkMode ? 'text-blue-400' : 'text-blue-800'}`}>
          Veo 3 Prompt Generator
        </h1>

        {/* Dark Mode Toggle */}
        <div className="flex justify-end mb-4">
          <label htmlFor="darkModeToggle" className="flex items-center cursor-pointer">
            <span className={`text-sm font-medium mr-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Mode Gelap
            </span>
            <div className="relative">
              <input
                type="checkbox"
                id="darkModeToggle"
                className="sr-only"
                checked={darkMode}
                onChange={() => setDarkMode(!darkMode)}
              />
              <div className={`block w-12 h-6 rounded-full transition-colors duration-300
                ${darkMode ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
              <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300
                ${darkMode ? 'transform translate-x-full bg-gray-200' : ''}`}></div>
            </div>
          </label>
        </div>


        {/* --- Image Upload Section --- */}
        <h2 className={`text-2xl font-bold mb-4 text-center transition-colors duration-300
          ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
          Deskripsi Gambar Otomatis
        </h2>
        <div className={`mb-8 p-6 border border-dashed rounded-xl text-center shadow-inner transition-colors duration-300
          ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'}`}>
          <label htmlFor="imageUpload" className={`block text-lg font-semibold mb-3 cursor-pointer hover:text-blue-600 transition-colors duration-300
            ${darkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600'}`}>
            Unggah Gambar Anda di Sini
          </label>
          <input
            type="file"
            id="imageUpload"
            accept="image/*"
            onChange={handleImageUpload}
            className={`block w-full text-sm
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:transition-colors file:duration-300
                        ${darkMode ? 'text-gray-100 file:bg-blue-800 file:text-blue-100 hover:file:bg-blue-700' : 'text-gray-900 file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200'} cursor-pointer`}
          />
          {uploadedImage && (
            <div className="mt-6">
              <p className={`text-sm mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Gambar terpilih: <span className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{uploadedImage.name}</span></p>
              {/* Display image preview */}
              <img
                src={URL.createObjectURL(uploadedImage)}
                alt="Pratinjau Gambar"
                className="max-w-full sm:max-w-xs max-h-48 mx-auto rounded-lg shadow-md border border-gray-200 object-contain"
              />
            </div>
          )}
          <div className="flex flex-col sm:flex-row justify-center gap-3 mt-6">
            <button
              onClick={describeImage}
              disabled={!uploadedImage || isDescribingImage}
              className={`flex-1 px-6 py-2 rounded-lg font-semibold transition duration-300
                ${!uploadedImage || isDescribingImage
                  ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700 shadow-md transform hover:scale-105'
                }`}
            >
              {isDescribingImage ? 'Mendeskripsikan Gambar...' : 'Deskripsikan Gambar (Lengkap)'}
            </button>
            <button
              onClick={describeSubjectDetails}
              disabled={!uploadedImage || subjectDescriptionLoading}
              className={`flex-1 px-6 py-2 rounded-lg font-semibold transition duration-300
                ${!uploadedImage || subjectDescriptionLoading
                  ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md transform hover:scale-105'
                }`}
            >
              {subjectDescriptionLoading ? 'Mendeskripsikan Subjek...' : 'Deskripsikan Subjek'}
            </button>
            <button
              onClick={describePlaceDetails}
              disabled={!uploadedImage || placeDescriptionLoading}
              className={`flex-1 px-6 py-2 rounded-lg font-semibold transition duration-300
                ${!uploadedImage || placeDescriptionLoading
                  ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                  : 'bg-purple-600 text-white hover:bg-purple-700 shadow-md transform hover:scale-105'
                }`}
            >
              {placeDescriptionLoading ? 'Mendeskripsikan Tempat...' : 'Deskripsikan Tempat'}
            </button>
          </div>
          {(imageDescriptionError || subjectError || placeError) && (
            <p className="text-red-600 text-sm mt-4 font-medium">
              {imageDescriptionError || subjectError || placeError}
            </p>
          )}
        </div>

        {/* --- Video Details Form Section --- */}
        <h2 className={`text-2xl font-bold mb-4 text-center transition-colors duration-300
          ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
          Detail Video Manual
        </h2>
        {/* Simplified grid for all input fields */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4 mb-8 p-4 rounded-xl shadow-inner transition-colors duration-300
          ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>

          {/* Subject Details */}
          <div className="relative">
            <label htmlFor="subject" className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Subjek (Siapa/Apa) / Subject (Who/What)</label>
            <input type="text" id="subject" className={`input-field ${darkMode ? 'dark-input-field' : ''}`} value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Contoh: Astronot, Robot"/>
          </div>
          <div className="relative">
            <label htmlFor="subjectAge" className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Usia Subjek / Subject Age</label>
            <input type="text" id="subjectAge" className={`input-field ${darkMode ? 'dark-input-field' : ''}`} value={subjectAge} onChange={(e) => setSubjectAge(e.target.value)} placeholder="Contoh: Dewasa, Anak-anak"/>
          </div>
          <div className="relative">
            <label htmlFor="subjectGender" className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Jenis Kelamin Subjek / Subject Gender</label>
            <input type="text" id="subjectGender" className={`input-field ${darkMode ? 'dark-input-field' : ''}`} value={subjectGender} onChange={(e) => setSubjectGender(e.target.value)} placeholder="Contoh: Pria, Wanita"/>
          </div>
          <div className="relative">
            <label htmlFor="subjectAttire" className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Pakaian Subjek / Subject Attire</label>
            <input type="text" id="subjectAttire" className={`input-field ${darkMode ? 'dark-input-field' : ''}`} value={subjectAttire} onChange={(e) => setSubjectAttire(e.target.value)} placeholder="Contoh: Jas formal, Gaun malam"/>
          </div>
          <div className="relative">
            <label htmlFor="subjectAccessories" className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Aksesoris Subjek / Subject Accessories</label>
            <input type="text" id="subjectAccessories" className={`input-field ${darkMode ? 'dark-input-field' : ''}`} value={subjectAccessories} onChange={(e) => setSubjectAccessories(e.target.value)} placeholder="Contoh: Kacamata hitam, Topi"/>
          </div>
          <div className="relative">
            <label htmlFor="subjectAppearance" className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Penampilan Subjek / Subject Appearance</label>
            <input type="text" id="subjectAppearance" className={`input-field ${darkMode ? 'dark-input-field' : ''}`} value={subjectAppearance} onChange={(e) => setSubjectAppearance(e.target.value)} placeholder="Contoh: Rambut pirang, Kulit gelap"/>
          </div>
          <div className="relative">
            <label htmlFor="characterArchetype" className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Arketipe Karakter / Character Archetype</label>
            <input type="text" id="characterArchetype" className={`input-field ${darkMode ? 'dark-input-field' : ''}`} value={characterArchetype} onChange={(e) => setCharacterArchetype(e.target.value)} placeholder="Contoh: Pahlawan, Penjahat, Mentor"/>
          </div>

          {/* Action & Expression */}
          <div className="relative">
            <label htmlFor="action" className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Aksi (Apa yang terjadi) / Action (What is happening)</label>
            <input type="text" id="action" className={`input-field ${darkMode ? 'dark-input-field' : ''}`} value={action} onChange={(e) => setAction(e.target.value)} placeholder="Contoh: Melayang, Berlari"/>
          </div>
          <div className="relative">
            <label htmlFor="expression" className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Ekspresi (Emosi) / Expression (Emotion)</label>
            <input type="text" id="expression" className={`input-field ${darkMode ? 'dark-input-field' : ''}`} value={expression} onChange={(e) => setExpression(e.target.value)} placeholder="Contoh: Gembira, Sedih"/>
          </div>
          <div className="relative">
            <label htmlFor="interactionType" className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Jenis Interaksi / Interaction Type</label>
            <input type="text" id="interactionType" className={`input-field ${darkMode ? 'dark-input-field' : ''}`} value={interactionType} onChange={(e) => setInteractionType(e.target.value)} placeholder="Contoh: Berbicara, Bertarung"/>
          </div>
          <div className="relative">
            <label htmlFor="paceOfAction" className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Kecepatan Aksi / Pace of Action</label>
            <input type="text" id="paceOfAction" className={`input-field ${darkMode ? 'dark-input-field' : ''}`} value={paceOfAction} onChange={(e) => setPaceOfAction(e.target.value)} placeholder="Contoh: Cepat, Lambat"/>
          </div>

          {/* Environment & Atmosphere */}
          <div className="relative">
            <label htmlFor="place" className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Tempat (Latar belakang) / Place (Background)</label>
            <input type="text" id="place" className={`input-field ${darkMode ? 'dark-input-field' : ''}`} value={place} onChange={(e) => setPlace(e.target.value)} placeholder="Contoh: Kota futuristik, Hutan"/>
          </div>
          <div className="relative">
            <label htmlFor="eraSetting" className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Pengaturan Era / Era Setting</label>
            <input type="text" id="eraSetting" className={`input-field ${darkMode ? 'dark-input-field' : ''}`} value={eraSetting} onChange={(e) => setEraSetting(e.target.value)} placeholder="Contoh: Abad Pertengahan, Futuristik"/>
          </div>
          <div className="relative">
            <label htmlFor="specificLocationDetails" className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Detail Lokasi Spesifik / Specific Location Details</label>
            <input type="text" id="specificLocationDetails" className={`input-field ${darkMode ? 'dark-input-field' : ''}`} value={specificLocationDetails} onChange={(e) => setSpecificLocationDetails(e.target.value)} placeholder="Contoh: Pegunungan Alpen, Gurun Sahara"/>
          </div>
          <div className="relative">
            <label htmlFor="moodAtmosphere" className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Suasana/Mood / Mood/Atmosphere</label>
            <input type="text" id="moodAtmosphere" className={`input-field ${darkMode ? 'dark-input-field' : ''}`} value={moodAtmosphere} onChange={(e) => setMoodAtmosphere(e.target.value)} placeholder="Contoh: Tegang, Romantis"/>
          </div>
          <div className="relative">
            <label htmlFor="time" className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Waktu (Umum) / Time (General)</label>
            <select id="time" className={`input-field ${darkMode ? 'dark-input-field' : 'bg-white'}`} value={time} onChange={(e) => setTime(e.target.value)}>
              <option value="">Pilih Waktu / Select Time</option>
              <option value="Pagi">Pagi / Morning</option>
              <option value="Siang">Siang / Day</option>
              <option value="Sore">Sore / Afternoon</option>
              <option value="Malam">Malam / Night</option>
            </select>
          </div>
          <div className="relative">
            <label htmlFor="timeOfDayDetail" className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Detail Waktu / Time Detail</label>
            <input type="text" id="timeOfDayDetail" className={`input-field ${darkMode ? 'dark-input-field' : ''}`} value={timeOfDayDetail} onChange={(e) => setTimeOfDayDetail(e.target.value)} placeholder="Contoh: Fajar, Senja"/>
          </div>
          <div className="relative">
            <label htmlFor="weather" className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Cuaca / Weather</label>
            <input type="text" id="weather" className={`input-field ${darkMode ? 'dark-input-field' : ''}`} value={weather} onChange={(e) => setWeather(e.target.value)} placeholder="Contoh: Cerah, Hujan salju"/>
          </div>
          <div className="relative">
            <label htmlFor="colorPalette" className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Palet Warna / Color Palette</label>
            <input type="text" id="colorPalette" className={`input-field ${darkMode ? 'dark-input-field' : ''}`} value={colorPalette} onChange={(e) => setColorPalette(e.target.value)} placeholder="Contoh: Hangat, Dingin"/>
          </div>
          <div className="relative">
            <label htmlFor="props" className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Properti / Props</label>
            <input type="text" id="props" className={`input-field ${darkMode ? 'dark-input-field' : ''}`} value={props} onChange={(e) => setProps(e.target.value)} placeholder="Contoh: Buku tua, Mobil terbang"/>
          </div>

          {/* Camera & Cinematography */}
          <div className="relative">
            <label htmlFor="cameraAngle" className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Sudut Kamera / Camera Angle</label>
            <input type="text" id="cameraAngle" className={`input-field ${darkMode ? 'dark-input-field' : ''}`} value={cameraAngle} onChange={(e) => setCameraAngle(e.target.value)} placeholder="Contoh: Close-up, Sudut lebar"/>
          </div>
          <div className="relative">
            <label htmlFor="cameraMovement" className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Gerakan Kamera / Camera Movement</label>
            <input type="text" id="cameraMovement" className={`input-field ${darkMode ? 'dark-input-field' : ''}`} value={cameraMovement} onChange={(e) => setCameraMovement(e.target.value)} placeholder="Contoh: Pan, Tilt"/>
          </div>
          <div className="relative">
            <label htmlFor="lensType" className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Jenis Lensa / Lens Type</label>
            <input type="text" id="lensType" className={`input-field ${darkMode ? 'dark-input-field' : ''}`} value={lensType} onChange={(e) => setLensType(e.target.value)} placeholder="Contoh: Sudut Lebar, Telefoto"/>
          </div>
          <div className="relative">
            <label htmlFor="focusTechnique" className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Teknik Fokus / Focus Technique</label>
            <input type="text" id="focusTechnique" className={`input-field ${darkMode ? 'dark-input-field' : ''}`} value={focusTechnique} onChange={(e) => setFocusTechnique(e.target.value)} placeholder="Contoh: Fokus Dangkal, Fokus Dalam"/>
          </div>
          <div className="relative">
            <label htmlFor="shotType" className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Jenis Shot / Shot Type</label>
            <input type="text" id="shotType" className={`input-field ${darkMode ? 'dark-input-field' : ''}`} value={shotType} onChange={(e) => setShotType(e.target.value)} placeholder="Contoh: Extreme Close-up, Long Shot"/>
          </div>

          {/* Lighting & Style */}
          <div className="relative">
            <label htmlFor="lighting" className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Pencahayaan / Lighting</label>
            <input type="text" id="lighting" className={`input-field ${darkMode ? 'dark-input-field' : ''}`} value={lighting} onChange={(e) => setLighting(e.target.value)} placeholder="Contoh: Cahaya alami, Neon"/>
          </div>
          <div className="relative">
            <label htmlFor="videoStyle" className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Gaya Video / Video Style</label>
            <input type="text" id="videoStyle" className={`input-field ${darkMode ? 'dark-input-field' : ''}`} value={videoStyle} onChange={(e) => setVideoStyle(e.target.value)} placeholder="Contoh: Animasi 3D, Sinematik"/>
          </div>

          {/* Video Production Details */}
          <div className="relative">
            <label htmlFor="aspectRatio" className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Rasio Aspek / Aspect Ratio</label>
            <select id="aspectRatio" className={`input-field ${darkMode ? 'dark-input-field' : 'bg-white'}`} value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value)}>
              <option value="">Pilih Rasio Aspek</option>
              <option value="16:9">16:9 (Layar Lebar)</option>
              <option value="9:16">9:16 (Vertikal/Story)</option>
              <option value="1:1">1:1 (Persegi)</option>
              <option value="4:3">4:3 (Klasik)</option>
            </select>
          </div>
          <div className="relative">
            <label htmlFor="resolution" className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Resolusi / Resolution</label>
            <select id="resolution" className={`input-field ${darkMode ? 'dark-input-field' : 'bg-white'}`} value={resolution} onChange={(e) => setResolution(e.target.value)}>
              <option value="">Pilih Resolusi</option>
              <option value="720p">720p (HD)</option>
              <option value="1080p">1080p (Full HD)</option>
              <option value="4K">4K (Ultra HD)</option>
              <option value="8K">8K</option>
            </select>
          </div>
          <div className="relative">
            <label htmlFor="duration" className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Durasi / Duration</label>
            <input type="text" id="duration" className={`input-field ${darkMode ? 'dark-input-field' : ''}`} value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="Contoh: 10 detik, 1 menit"/>
          </div>
          <div className="relative md:col-span-2 lg:col-span-3"> {/* Full width on smaller screens, spans all on larger */}
            <label htmlFor="visualEffects" className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Efek Visual (VFX) / Visual Effects</label>
            <textarea id="visualEffects" rows="4" className={`input-field ${darkMode ? 'dark-input-field' : ''}`} value={visualEffects} onChange={(e) => setVisualEffects(e.target.value)} placeholder="Contoh: Efek asap tebal, Kilatan cahaya, Gerakan lambat (slow motion)"/>
          </div>

          {/* Audio & Narration */}
          <div className="relative">
            <label htmlFor="backsound" className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Backsound / Background Sound</label>
            <input type="text" id="backsound" className={`input-field ${darkMode ? 'dark-input-field' : ''}`} value={backsound} onChange={(e) => setBacksound(e.target.value)} placeholder="Contoh: Musik orkestra, Suara alam"/>
          </div>
          <div className="relative">
            <label htmlFor="musicGenre" className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Genre Musik / Music Genre</label>
            <input type="text" id="musicGenre" className={`input-field ${darkMode ? 'dark-input-field' : ''}`} value={musicGenre} onChange={(e) => setMusicGenre(e.target.value)} placeholder="Contoh: Klasik, Jazz, Pop"/>
          </div>
          <div className="relative md:col-span-2 lg:col-span-3"> {/* Full width on smaller screens, spans all on larger */}
            <label htmlFor="soundEffects" className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Efek Suara (SFX) / Sound Effects</label>
            <textarea id="soundEffects" rows="4" className={`input-field ${darkMode ? 'dark-input-field' : ''}`} value={soundEffects} onChange={(e) => setSoundEffects(e.target.value)} placeholder="Contoh: Suara langkah kaki, Deru mesin, Tawa anak-anak"/>
          </div>
          <div className="relative md:col-span-2 lg:col-span-3"> {/* Full width on smaller screens, spans all on larger */}
            <label htmlFor="spokenWords" className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Kalimat yang Diucapkan / Spoken Words</label>
            <textarea id="spokenWords" rows="4" className={`input-field ${darkMode ? 'dark-input-field' : ''}`} value={spokenWords} onChange={(e) => setSpokenWords(e.target.value)} placeholder="Contoh: 'Selamat datang di masa depan!'"/>
          </div>
          <div className="relative md:col-span-2 lg:col-span-3"> {/* Full width on smaller screens, spans all on larger */}
            <label htmlFor="dialogueSnippet" className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Kutipan Dialog / Dialogue Snippet</label>
            <textarea id="dialogueSnippet" rows="5" className={`input-field ${darkMode ? 'dark-input-field' : ''}`} value={dialogueSnippet} onChange={(e) => setDialogueSnippet(e.target.value)} placeholder="Contoh: Karakter A: 'Apa yang harus kita lakukan?', Karakter B: 'Kita harus melawan!'"/>
          </div>
          <div className="relative">
            <label htmlFor="voiceOver" className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Narasi/Voice Over / Voice Over</label>
            <input type="text" id="voiceOver" className={`input-field ${darkMode ? 'dark-input-field' : ''}`} value={voiceOver} onChange={(e) => setVoiceOver(e.target.value)} placeholder="Contoh: Suara Pencerita, Dialog Internal"/>
          </div>
          <div className="relative">
            <label htmlFor="soundScape" className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Lanskap Suara / Soundscape</label>
            <input type="text" id="soundScape" className={`input-field ${darkMode ? 'dark-input-field' : ''}`} value={soundScape} onChange={(e) => setSoundScape(e.target.value)} placeholder="Contoh: Hutan Rimba, Kota Sibuk"/>
          </div>

          {/* Overall Project Details */}
          <div className="relative">
            <label htmlFor="genre" className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Genre / Genre</label>
            <input type="text" id="genre" className={`input-field ${darkMode ? 'dark-input-field' : ''}`} value={genre} onChange={(e) => setGenre(e.target.value)} placeholder="Contoh: Fiksi Ilmiah, Fantasi"/>
          </div>
          <div className="relative">
            <label htmlFor="targetAudience" className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Target Audiens / Target Audience</label>
            <input type="text" id="targetAudience" className={`input-field ${darkMode ? 'dark-input-field' : ''}`} value={targetAudience} onChange={(e) => setTargetAudience(e.target.value)} placeholder="Contoh: Anak-anak, Remaja, Dewasa"/>
          </div>
          <div className="relative">
            <label htmlFor="messageTheme" className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Pesan/Tema / Message/Theme</label>
            <input type="text" id="messageTheme" className={`input-field ${darkMode ? 'dark-input-field' : ''}`} value={messageTheme} onChange={(e) => setMessageTheme(e.target.value)} placeholder="Contoh: Harapan, Perjuangan"/>
          </div>

          {/* Additional Details (always full width for multi-line input) */}
          <div className="relative md:col-span-2 lg:col-span-3">
            <label htmlFor="additionalDetails" className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Detail Tambahan / Additional Details
            </label>
            <textarea
              id="additionalDetails"
              rows="5"
              className={`input-field ${darkMode ? 'dark-input-field' : ''}`}
              value={additionalDetails}
              onChange={(e) => setAdditionalDetails(e.target.value)}
              placeholder="Contoh: Nuansa warna spesifik, Gaya rambut karakter, Interaksi unik"
            ></textarea>
          </div>
        </div>

        {/* Action Buttons: Generate and Reset */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
          <button
            onClick={generatePrompt}
            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition duration-300 transform hover:scale-105 flex-1"
          >
            Buat Prompt / Generate Prompt
          </button>
          <button
            onClick={resetForm}
            className="px-8 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg shadow-lg hover:bg-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-300 transition duration-300 transform hover:scale-105 flex-1"
          >
            Reset Formulir / Reset Form
          </button>
        </div>

        {/* --- Prompt Output Section --- */}
        <h2 className={`text-2xl font-bold mb-4 text-center transition-colors duration-300
          ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
          Hasil Prompt
        </h2>
        <div className={`p-4 rounded-xl shadow-inner border transition-colors duration-300
          ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-blue-50 border-blue-100'}`}>
            {/* Display area for generated Indonesian prompt */}
            <div className="mb-6">
            <label className={`block text-xl font-bold mb-2 ${darkMode ? 'text-blue-400' : 'text-blue-700'}`}>
                Prompt (Bahasa Indonesia):
            </label>
            <div className="relative">
                <textarea
                    readOnly
                    rows="8"
                    className={`w-full p-4 border rounded-lg focus:outline-none resize-y shadow-sm transition-colors duration-300
                      ${darkMode ? 'bg-gray-800 border-gray-600 text-gray-200' : 'bg-white border-blue-300 text-gray-800'}`}
                    value={promptId}
                    placeholder="Prompt Bahasa Indonesia Anda akan muncul di sini."
                ></textarea>
                <button
                    onClick={() => copyToClipboard(promptId)}
                    className="absolute top-2 right-2 px-3 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition-colors"
                >
                    Salin
                </button>
            </div>
            </div>

            {/* Display area for generated English prompt */}
            <div>
            <label className={`block text-xl font-bold mb-2 ${darkMode ? 'text-blue-400' : 'text-blue-700'}`}>
                Prompt (English):
            </label>
            <div className="relative">
                <textarea
                    readOnly
                    rows="8"
                    className={`w-full p-4 border rounded-lg focus:outline-none resize-y shadow-sm transition-colors duration-300
                      ${darkMode ? 'bg-gray-800 border-gray-600 text-gray-200' : 'bg-white border-blue-300 text-gray-800'}`}
                    value={promptEn}
                    placeholder="Your English prompt will appear here."
                ></textarea>
                <button
                    onClick={() => copyToClipboard(promptEn)}
                    className="absolute top-2 right-2 px-3 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition-colors"
                >
                    Salin
                </button>
            </div>
            </div>
            {/* New button to open Gemini */}
            <div className="flex justify-center mt-6">
                <button
                    onClick={openGemini}
                    className="px-8 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-lg hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300 transition duration-300 transform hover:scale-105"
                >
                    Buka di Gemini
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}

export default App;
