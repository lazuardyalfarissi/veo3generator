import React, { useState, useEffect } from 'react';
// Firebase imports removed as they are not essential for core prompt generation and cause local errors.

// Define the main App component
const App = () => {
    // State variables for form inputs
    const [subject, setSubject] = useState('');
    const [action, setAction] = useState('');
    const [environment, setEnvironment] = useState('');
    const [styleGenre, setStyleGenre] = useState('');
    const [moodTone, setMoodTone] = useState('');
    const [cameraAngles, setCameraAngles] = useState('');
    const [lighting, setLighting] = useState('');
    const [soundElements, setSoundElements] = useState('');
    const [dialogue, setDialogue] = useState(''); // New state for dialogue
    const [generatedPrompt, setGeneratedPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState(''); // For user messages like copy success

    // State variables for general conversational assistant
    const [conversationalInput, setConversationalInput] = useState('');
    const [conversationalResponse, setConversationalResponse] = useState('');
    const [isAssistantLoading, setIsAssistantLoading] = useState(false);

    // State variables for sound-specific conversational assistant
    const [soundConversationalInput, setSoundConversationalInput] = useState('');
    const [soundConversationalResponse, setSoundConversationalResponse] = useState('');
    const [isSoundAssistantLoading, setIsSoundAssistantLoading] = useState(false);

    // State variables for password protection
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [passwordInput, setPasswordInput] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const CORRECT_PASSWORD = "GENJOYVEO3KEREN"; // Define the correct password

    // Pre-defined prompt templates
    const templates = [
        {
            name: "Pilih Template",
            subject: '', action: '', environment: '', styleGenre: '',
            moodTone: '', cameraAngles: '', lighting: '', soundElements: '', dialogue: ''
        },
        {
            name: "Kota Masa Depan",
            subject: "mobil terbang otonom",
            action: "melayang melalui cakrawala yang diterangi neon",
            environment: "kota cyberpunk yang ramai di malam malam hari, gedung pencakar langit futuristik",
            styleGenre: "fiksi ilmiah, futuristik, visual sinematik",
            moodTone: "sibuk, berteknologi tinggi, sedikit dystopian",
            cameraAngles: "drone view, close-up mobil, pergerakan kamera halus",
            lighting: "cahaya neon yang cerah, bayangan dramatis dari bangunan tinggi",
            soundElements: "suara berdengung dari mobil, musik synthwave, efek suara kota",
            dialogue: "Narator: 'Di masa depan yang tidak terlalu jauh, kota ini tidak pernah tidur.'"
        },
        {
            name: "Hutan Mistis",
            subject: "makhluk hutan bercahaya",
            action: "menari di antara pohon-pohon kuno",
            environment: "hutan fantasi yang diselimuti kabut, lumut bercahaya",
            styleGenre: "fantasi, dongeng, visual surealis",
            moodTone: "magis, tenang, misterius",
            cameraAngles: "shot stabil, pergerakan kamera lambat, mengikuti makhluk",
            lighting: "cahaya rembulan yang lembut, kilauan makhluk bercahaya",
            soundElements: "bisikan angin, musik eterik, suara hutan yang lembut",
            dialogue: "Suara ethereal: 'Rahasia kuno berbisik di pepohonan.'"
        },
        {
            name: "Puncak Gunung Bersalju",
            subject: "pendaki gunung sendirian",
            action: "mencapai puncak gunung bersalju yang tertutup es",
            environment: "pemandangan gunung yang luas, puncak es yang tajam, langit fajar",
            styleGenre: "petualangan, dokumenter, realisme",
            moodTone: "mengharukan, epik, dingin",
            cameraAngles: "helicopter shot, close-up tangan, panning shot panorama",
            lighting: "cahaya fajar yang dingin, siluet tajam",
            soundElements: "angin bertiup kencang, derap langkah di salju, napas berat",
            dialogue: "Pendaki (terengah-engah): 'Hampir sampai... satu langkah lagi.'"
        },
        {
            name: "Kafe yang Sibuk",
            subject: "sepasang teman",
            action: "tertawa dan mengobrol sambil menyeruput kopi",
            environment: "kafe yang nyaman dengan cahaya hangat, ramai dengan pengunjung",
            styleGenre: "slice-of-life, drama, realistis",
            moodTone: "nyaman, hidup, menyenangkan",
            cameraAngles: "medium shot, close-up tangan memegang cangkir, pergerakan kamera halus",
            lighting: "cahaya alami yang hangat dari jendela, lampu gantung redup",
            soundElements: "gemerincing cangkir, gumaman percakapan, musik jazz yang lembut",
            dialogue: "Teman 1: 'Kamu tidak akan percaya apa yang terjadi kemarin!' Teman 2: 'Ceritakan semuanya!'"
        },
        {
            name: "Pertarungan Robot Raksasa",
            subject: "dua robot tempur kolosal",
            action: "saling berhadapan dalam pertarungan intens",
            environment: "reruntuhan kota pasca-apokaliptik, asap mengepul",
            styleGenre: "aksi, sci-fi, mecha, visual sinematik",
            moodTone: "intens, destruktif, menegangkan",
            cameraAngles: "long shot dramatis, close-up tinju menghantam, pergerakan kamera cepat",
            lighting: "cahaya oranye dari ledakan, bayangan panjang dari robot",
            soundElements: "suara logam beradu, ledakan, dengungan energi, raungan robot",
            dialogue: "Robot Alpha (suara sintetis): 'Penghancuran adalah satu-satunya jalan menuju ketertiban!'"
        },
        {
            name: "Detektif Malam Hari",
            subject: "detektif swasta",
            action: "berjalan di gang gelap dan sepi",
            environment: "gang sempit di kota besar, genangan air memantulkan cahaya neon",
            styleGenre: "noir, misteri, film detektif klasik",
            moodTone: "suram, misterius, tegang",
            cameraAngles: "low angle shot, following shot dari belakang, close-up wajah detektif",
            lighting: "cahaya redup dari lampu jalan, bayangan tajam, pantulan neon",
            soundElements: "suara tetesan air, langkah kaki di genangan, musik jazz yang melankolis",
            dialogue: "Narator (suara serak): 'Kota ini menyimpan banyak rahasia, dan tugasku adalah mengungkapnya.'"
        },
        {
            name: "Pesta Musim Panas",
            subject: "sekumpulan remaja",
            action: "menari dan bersenang-senang di tepi pantai saat matahari terbenam",
            environment: "pantai berpasir, api unggun kecil, tenda-tenda warna-warni",
            styleGenre: "komedi, remaja, musik video",
            moodTone: "cerah, energik, bahagia",
            cameraAngles: "wide shot pantai, close-up wajah tertawa, panning melintasi keramaian",
            lighting: "cahaya keemasan matahari terbenam, kilauan api unggun",
            soundElements: "musik pop ceria, tawa, deburan ombak, suara kembang api",
            dialogue: "Remaja A: 'Ini adalah malam terbaik sepanjang musim panas!'"
        },
        {
            name: "Penjelajah Antarbintang",
            subject: "pesawat luar angkasa tunggal",
            action: "meluncur melalui nebula yang menakjubkan",
            environment: "luar angkasa, nebula berwarna-warni, bintang-bintang jauh",
            styleGenre: "fiksi ilmiah, epik luar angkasa, visual sinematik 3D",
            moodTone: "damai, megah, penjelajahan",
            cameraAngles: "slow zoom out, orbital shot, flying through nebula",
            lighting: "cahaya lembut dari nebula, kilauan bintang",
            soundElements: "musik orkestra kosmik, suara mesin pesawat luar angkasa yang tenang, bisikan kosmik",
            dialogue: "Kapten: 'Kita memasuki wilayah yang belum pernah terjamah. Spektakuler.'"
        }
    ];

    // Removed Firebase initialization and authentication related code
    // as it's not needed for local execution and caused "not defined" errors for global variables.
    // The core functionality (prompt generation via Gemini API) does not depend on Firebase auth.
    useEffect(() => {}, []); // Empty dependency array means this runs once on component mount

    // Handle template selection from dropdown
    const handleTemplateChange = (event) => {
        const selectedTemplateName = event.target.value;
        const selectedTemplate = templates.find(t => t.name === selectedTemplateName);

        if (selectedTemplate) {
            setSubject(selectedTemplate.subject);
            setAction(selectedTemplate.action);
            setEnvironment(selectedTemplate.environment);
            setStyleGenre(selectedTemplate.styleGenre);
            setMoodTone(selectedTemplate.moodTone);
            setCameraAngles(selectedTemplate.cameraAngles);
            setLighting(selectedTemplate.lighting);
            setSoundElements(selectedTemplate.soundElements);
            setDialogue(selectedTemplate.dialogue); // Set dialogue from template
            setGeneratedPrompt(''); // Clear generated prompt when template changes
        }
    };

    // Function to generate the structured prompt using the Gemini API
    const generatePrompt = async () => {
        setIsLoading(true);
        setGeneratedPrompt(''); // Clear previous prompt
        setMessage(''); // Clear previous messages

        // Construct the prompt for the LLM, requesting both Indonesian and English versions
        const userPrompt = `
            Hasilkan prompt pembuatan video yang sangat detail dan kreatif untuk model text-to-video seperti Veo 3, berdasarkan elemen-elemen berikut. Fokus pada deskripsi yang jelas dan bahasa sinematik.
            Berikan prompt dalam dua versi: satu dalam Bahasa Indonesia dan satu dalam Bahasa Inggris. Beri label setiap versi dengan jelas (misalnya, "Bahasa Indonesia:" dan "English:").

            Subjek: ${subject || 'sebuah objek atau karakter umum'}
            Aksi: ${action || 'aktivitas yang menarik'}
            Lingkungan: ${environment || 'latar yang menakjubkan'}
            Gaya/Genre: ${styleGenre || 'gaya film sinematik realistis'}
            Suasana Hati/Nada: ${moodTone || 'suasana yang sesuai'}
            Sudut/Pergerakan Kamera: ${cameraAngles || 'sudut pandang standar'}
            Pencahayaan: ${lighting || 'pencahayaan alami'}
            Elemen Suara: ${soundElements || 'suara latar yang mendalam'}
            Dialog/Narasi: ${dialogue || 'tidak ada dialog atau narasi spesifik'}

            Pastikan keluarannya adalah satu paragraf yang koheren untuk setiap bahasa. Jangan sertakan komentar pengantar atau penutup, hanya prompt itu sendiri.
        `;

        try {
            // !!! PENTING: Ganti "YOUR_GEMINI_API_KEY_HERE" dengan kunci API Gemini Anda yang sebenarnya.
            // PASTIKAN KUNCI API ANDA ADA DI SINI.
            const apiKey = "AIzaSyAtdXVf1Hg2hTOi67zxYr23-vAzL2k527k"; // <--- PASTE KUNCI API ANDA DI SINI

            // Prepare the payload for the Gemini API call
            const chatHistory = [{ role: "user", parts: [{ text: userPrompt }] }];
            const payload = { contents: chatHistory };

            // Make the API call to generate content
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            // Parse the response
            const result = await response.json();

            // Extract the generated text
            if (result.candidates && result.candidates.length > 0 &&
                result.candidates[0].content && result.candidates[0].content.parts &&
                result.candidates[0].content.parts.length > 0) {
                const text = result.candidates[0].content.parts[0].text;
                setGeneratedPrompt(text);
            } else {
                // Periksa apakah ada error dari API itu sendiri
                if (result.error && result.error.message) {
                    setGeneratedPrompt(`Gagal menghasilkan prompt. Pesan error dari API: ${result.error.message}`);
                    console.error("API Error:", result.error);
                } else {
                    setGeneratedPrompt('Gagal menghasilkan prompt. Respons API tidak terduga.');
                }
            }
        } catch (error) {
            console.error("Kesalahan saat menghasilkan prompt:", error);
            setGeneratedPrompt('Terjadi kesalahan jaringan atau API. Silakan coba lagi.');
        } finally {
            setIsLoading(false);
        }
    };

    // Function to handle general conversational assistant
    const askAssistant = async () => {
        setIsAssistantLoading(true);
        setConversationalResponse(''); // Clear previous response

        if (!conversationalInput.trim()) {
            setConversationalResponse('Mohon masukkan ide atau pertanyaan Anda.');
            setIsAssistantLoading(false);
            return;
        }

        const assistantPrompt = `
            Anda adalah asisten pembuatan prompt video ahli untuk Veo 3. Pengguna akan memberikan ide atau pertanyaan. Tanggapi dengan saran kreatif, ide-ide untuk mengisi bidang prompt (Subjek, Aksi, Lingkungan, Gaya/Genre, Suasana Hati/Nada, Sudut/Pergerakan Kamera, Pencahayaan, Elemen Suara, Dialog/Narasi), atau elaborasi yang membantu pengguna membangun prompt video yang lebih baik. Berikan jawaban Anda dalam Bahasa Indonesia dan Bahasa Inggris, dengan label "Bahasa Indonesia:" dan "English:". Jaga agar respons Anda tetap ringkas dan langsung pada intinya.
            Ide/Pertanyaan Pengguna: "${conversationalInput}"
        `;

        try {
            // !!! PENTING: Ganti "YOUR_GEMINI_API_KEY_HERE" dengan kunci API Gemini Anda yang sebenarnya.
            // PASTIKAN KUNCI API ANDA ADA DI SINI.
            const apiKey = "AIzaSyAtdXVf1Hg2hTOi67zxYr23-vAzL2k527k"; // <--- PASTE KUNCI API ANDA DI SINI

            const chatHistory = [{ role: "user", parts: [{ text: assistantPrompt }] }];
            const payload = { contents: chatHistory };

            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (result.candidates && result.candidates.length > 0 &&
                result.candidates[0].content && result.candidates[0].content.parts &&
                result.candidates[0].content.parts.length > 0) {
                const text = result.candidates[0].content.parts[0].text;
                setConversationalResponse(text);
            } else {
                if (result.error && result.error.message) {
                    setConversationalResponse(`Gagal mendapatkan respons dari asisten. Pesan error dari API: ${result.error.message}`);
                    console.error("API Error:", result.error);
                } else {
                    setConversationalResponse('Gagal mendapatkan respons dari asisten. Respons API tidak terduga.');
                }
            }
        } catch (error) {
            console.error("Kesalahan saat bertanya asisten:", error);
            setConversationalResponse('Terjadi kesalahan jaringan atau API. Silakan coba lagi.');
        } finally {
            setIsAssistantLoading(false);
        }
    };

    // Function to handle sound-specific conversational assistant
    const askSoundAssistant = async () => {
        setIsSoundAssistantLoading(true);
        setSoundConversationalResponse(''); // Clear previous response

        if (!soundConversationalInput.trim()) {
            setSoundConversationalResponse('Mohon masukkan ide suara atau pertanyaan Anda.');
            setIsSoundAssistantLoading(false);
            return;
        }

        const soundAssistantPrompt = `
            Anda adalah asisten khusus dalam pembuatan elemen suara dan dialog/narasi untuk prompt video Veo 3. Pengguna akan memberikan ide atau deskripsi umum terkait suara atau dialog. Tanggapi dengan saran-saran kreatif dan spesifik untuk mengisi bidang 'Elemen Suara' atau 'Dialog/Narasi' dalam prompt video. Pertimbangkan suara latar, efek suara, musik, serta dialog/narasi dan bagaimana mereka mendukung suasana. Berikan jawaban Anda dalam Bahasa Indonesia dan Bahasa Inggris, dengan label "Bahasa Indonesia:" dan "English:". Jaga agar respons Anda tetap ringkas dan langsung pada intinya.
            Ide Suara/Dialog/Pertanyaan Pengguna: "${soundConversationalInput}"
        `;

        try {
            // !!! PENTING: Ganti "YOUR_GEMINI_API_KEY_HERE" dengan kunci API Gemini Anda yang sebenarnya.
            // PASTIKAN KUNCI API ANDA ADA DI SINI.
            const apiKey = "AIzaSyAtdXVf1Hg2hTOi67zxYr23-vAzL2k527k"; // <--- PASTE KUNCI API ANDA DI SINI

            const chatHistory = [{ role: "user", parts: [{ text: soundAssistantPrompt }] }];
            const payload = { contents: chatHistory };

            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (result.candidates && result.candidates.length > 0 &&
                result.candidates[0].content && result.candidates[0].content.parts &&
                result.candidates[0].content.parts.length > 0) {
                const text = result.candidates[0].content.parts[0].text;
                setSoundConversationalResponse(text);
            } else {
                if (result.error && result.error.message) {
                    setSoundConversationalResponse(`Gagal mendapatkan respons dari asisten suara. Pesan error dari API: ${result.error.message}`);
                    console.error("API Error:", result.error);
                } else {
                    setSoundConversationalResponse('Gagal mendapatkan respons dari asisten suara. Respons API tidak terduga.');
                }
            }
        } catch (error) {
            console.error("Kesalahan saat bertanya asisten suara:", error);
            setSoundConversationalResponse('Terjadi kesalahan jaringan atau API. Silakan coba lagi.');
        } finally {
            setIsSoundAssistantLoading(false);
        }
    };

    // Function to set the sound elements input with the assistant's suggestion
    const useSoundSuggestion = () => {
        // Find the "English:" part and take the text after it
        const englishPartIndex = soundConversationalResponse.indexOf("English:");
        let suggestedText = soundConversationalResponse;
        if (englishPartIndex !== -1) {
            suggestedText = soundConversationalResponse.substring(englishPartIndex + "English:".length).trim();
            // Remove Indonesian part if present after English part
            const indonesianPartIndex = suggestedText.indexOf("Bahasa Indonesia:");
            if (indonesianPartIndex !== -1) {
                suggestedText = suggestedText.substring(0, indonesianPartIndex).trim();
            }
        } else {
            // If "English:" not found, try to extract from "Bahasa Indonesia:"
            const indonesianPartIndex = soundConversationalResponse.indexOf("Bahasa Indonesia:");
            if (indonesianPartIndex !== -1) {
                 suggestedText = soundConversationalResponse.substring(indonesianPartIndex + "Bahasa Indonesia:".length).trim();
            }
        }

        // Clean up leading/trailing quotes or extra labels if any
        suggestedText = suggestedText.replace(/^"|"$/g, '').trim(); // Remove surrounding quotes

        // A simple heuristic: if the suggestion contains "Dialog:" or "Dialogue:", apply to dialogue field, else to sound elements.
        // This is a basic approach and might need refinement for more complex scenarios.
        if (suggestedText.includes("Dialog:") || suggestedText.includes("Dialogue:") || suggestedText.includes("Narator:")) {
            setDialogue(suggestedText);
        } else {
            setSoundElements(suggestedText);
        }

        setMessage('Saran berhasil diterapkan!');
        setTimeout(() => setMessage(''), 3000);
    };


    // Function to copy text to clipboard
    const copyTextToClipboard = (textToCopy, lang) => {
        if (textToCopy) {
            const textArea = document.createElement('textarea');
            textArea.value = textToCopy;
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                setMessage(`Prompt Bahasa ${lang} berhasil disalin!`);
            } catch (err) {
                console.error(`Gagal menyalin prompt Bahasa ${lang}:`, err);
                setMessage(`Gagal menyalin prompt Bahasa ${lang}.`);
            }
            document.body.removeChild(textArea);
            setTimeout(() => setMessage(''), 3000); // Clear message after 3 seconds
        }
    };

    // Functions to extract and copy specific language prompts
    const copyIndonesianPrompt = () => {
        const indoLabel = "Bahasa Indonesia:";
        const engLabel = "English:";
        let indoPrompt = generatedPrompt;

        const engIndex = generatedPrompt.indexOf(engLabel);
        if (engIndex !== -1) {
            // If English part exists, take text before it.
            // Check if Indonesian label is also present and take text after it.
            const indoIndex = generatedPrompt.indexOf(indoLabel);
            if (indoIndex !== -1 && indoIndex < engIndex) {
                indoPrompt = generatedPrompt.substring(indoIndex + indoLabel.length, engIndex).trim();
            } else if (indoIndex === -1 && engIndex !== -1) {
                // If only English label, assume everything before it is Indonesian
                indoPrompt = generatedPrompt.substring(0, engIndex).trim();
            }
        } else {
            // If no English label, assume the whole prompt is Indonesian.
            const indoIndex = generatedPrompt.indexOf(indoLabel);
            if (indoIndex !== -1) {
                indoPrompt = generatedPrompt.substring(indoIndex + indoLabel.length).trim();
            }
        }
        copyTextToClipboard(indoPrompt, 'Indonesia');
    };

    const copyEnglishPrompt = () => {
        const engLabel = "English:";
        let engPrompt = generatedPrompt;

        const engIndex = generatedPrompt.indexOf(engLabel);
        if (engIndex !== -1) {
            engPrompt = generatedPrompt.substring(engIndex + engLabel.length).trim();
        } else {
            // If no English label, there's nothing to copy for English.
            engPrompt = '';
            setMessage('Tidak ada prompt Bahasa Inggris yang ditemukan.');
        }
        copyTextToClipboard(engPrompt, 'Inggris');
    };

    // Handle password login
    const handleLogin = (e) => {
        e.preventDefault();
        if (passwordInput === CORRECT_PASSWORD) {
            setIsAuthenticated(true);
            setPasswordError('');
        } else {
            setPasswordError('Kata sandi salah. Silakan coba lagi.');
        }
    };

    // Render password form if not authenticated
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-gray-100 p-4 sm:p-8 font-inter flex flex-col items-center justify-center">
                <div className="bg-gray-800 p-4 sm:p-8 rounded-xl shadow-2xl max-w-md w-full border border-gray-700 text-center">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-400 mb-6">
                        Akses Generator Prompt Veo 3
                    </h1>
                    <form onSubmit={handleLogin} className="flex flex-col gap-4">
                        <label htmlFor="password" className="block text-gray-300 text-lg font-semibold">
                            Masukkan Kata Sandi:
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={passwordInput}
                            onChange={(e) => setPasswordInput(e.target.value)}
                            className="w-full p-3 bg-gray-700/70 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:ring-3 focus:ring-blue-500 transition duration-200"
                            placeholder="Kata Sandi"
                        />
                        {passwordError && (
                            <p className="text-red-400 text-sm">{passwordError}</p>
                        )}
                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out transform hover:scale-105 active:scale-95"
                        >
                            Masuk
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    // Render main app content if authenticated
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-gray-100 p-4 sm:p-8 font-inter flex flex-col items-center justify-center">
            <div className="bg-gray-800 p-4 sm:p-8 rounded-xl shadow-2xl max-w-3xl w-full border border-gray-700">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-blue-400 mb-8 tracking-wide">
                    Generator Prompt Veo 3
                </h1>

                {/* Template Dropdown */}
                <div className="mb-6">
                    <label htmlFor="template-select" className="block text-gray-300 text-base sm:text-lg font-semibold mb-2">
                        Pilih Template:
                    </label>
                    <select
                        id="template-select"
                        onChange={handleTemplateChange}
                        className="w-full p-3 bg-gray-700/70 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:ring-3 focus:ring-blue-500 transition duration-200"
                    >
                        {templates.map((template, index) => (
                            <option key={index} value={template.name}>
                                {template.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Input fields */}
                    <Input id="subject" label="Subjek (Siapa/Apa)" value={subject} onChange={setSubject} placeholder="seekor naga terbang" />
                    <Input id="action" label="Aksi (Apa yang Terjadi)" value={action} onChange={setAction} placeholder="membakar desa abad pertengahan" />
                    <Input id="environment" label="Lingkungan (Di Mana)" value={environment} onChange={setEnvironment} placeholder="di atas lembah yang berkabut saat matahari terbit" />
                    <Input id="styleGenre" label="Gaya/Genre" value={styleGenre} onChange={setStyleGenre} placeholder="fantasi epik, sinematik, visual 3D yang realistis" />
                    <Input id="moodTone" label="Suasana Hati/Nada" value={moodTone} onChange={setMoodTone} placeholder="gelap, mengancam, megah" />
                    <Input id="cameraAngles" label="Sudut/Pergerakan Kamera" value={cameraAngles} onChange={setCameraAngles} placeholder="wide shot, pergerakan kamera dinamis yang mengikuti naga" />
                    <Input id="lighting" label="Pencahayaan" value={lighting} onChange={setLighting} placeholder="cahaya keemasan fajar, bayangan dramatis" />
                    <Input id="soundElements" label="Elemen Suara (Opsional)" value={soundElements} onChange={setSoundElements} placeholder="raungan naga yang menggelegar, jeritan, musik orkestra yang intens" />
                    {/* Updated Input for Dialogue to be a textarea */}
                    <Input id="dialogue" label="Dialog/Narasi (Opsional)" value={dialogue} onChange={setDialogue} placeholder="Narator: 'Selamat datang di masa depan.'" multiline rows={3} />
                </div>

                {/* Generate Prompt Button */}
                <button
                    onClick={generatePrompt}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-bold py-3 px-4 sm:py-4 sm:px-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:from-gray-600 disabled:to-gray-800"
                >
                    {isLoading ? 'Menghasilkan Prompt...' : 'Hasilkan Prompt'}
                </button>

                {/* Generated Prompt Display */}
                {generatedPrompt && (
                    <div className="mt-8 sm:mt-10 bg-gray-700/50 p-4 sm:p-6 rounded-lg border border-gray-600 shadow-inner">
                        <h2 className="text-xl sm:text-2xl font-semibold text-blue-300 mb-4">Prompt yang Dihasilkan:</h2>
                        <p className="text-gray-200 whitespace-pre-wrap break-words leading-relaxed text-sm sm:text-base">
                            {generatedPrompt}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 mt-4 sm:mt-6"> {/* Use flexbox for buttons */}
                            <button
                                onClick={copyIndonesianPrompt}
                                className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 text-white font-bold py-2 px-4 sm:py-3 sm:px-5 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out transform hover:scale-105 active:scale-95"
                            >
                                Salin Prompt Bahasa Indonesia
                            </button>
                            <button
                                onClick={copyEnglishPrompt}
                                className="w-full sm:w-auto bg-gradient-to-r from-teal-600 to-teal-800 hover:from-teal-700 hover:to-teal-900 text-white font-bold py-2 px-4 sm:py-3 sm:px-5 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out transform hover:scale-105 active:scale-95"
                            >
                                Salin Prompt Bahasa Inggris
                            </button>
                        </div>
                        {message && <p className="text-green-400 mt-3 text-sm">{message}</p>}
                    </div>
                )}

                {/* Conversational Assistant Section (General) */}
                <div className="mt-8 sm:mt-10 pt-8 sm:pt-10 border-t border-gray-700">
                    <h2 className="text-2xl sm:text-3xl font-bold text-center text-purple-400 mb-6">
                        Asisten Percakapan Umum
                    </h2>
                    <div className="mb-4">
                        <label htmlFor="conversational-input" className="block text-gray-300 text-base sm:text-lg font-semibold mb-2">
                            Ketik ide atau pertanyaan Anda di sini:
                        </label>
                        <textarea
                            id="conversational-input"
                            value={conversationalInput}
                            onChange={(e) => setConversationalInput(e.target.value)}
                            placeholder="Contoh: Saya ingin video tentang penyelamatan kucing di pohon."
                            rows="5"
                            className="w-full p-3 bg-gray-700/70 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:ring-3 focus:ring-purple-500 transition duration-200 text-sm sm:text-base"
                        ></textarea>
                    </div>
                    <button
                        onClick={askAssistant}
                        disabled={isAssistantLoading}
                        className="w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-bold py-3 px-4 sm:py-4 sm:px-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:from-gray-600 disabled:to-gray-800"
                    >
                        {isAssistantLoading ? 'Meminta Bantuan...' : 'Tanyakan Asisten'}
                    </button>

                    {conversationalResponse && (
                        <div className="mt-8 bg-gray-700/50 p-4 sm:p-6 rounded-lg border border-gray-600 shadow-inner">
                            <h3 className="text-xl sm:text-2xl font-semibold text-purple-300 mb-4">Respons Asisten:</h3>
                            <p className="text-gray-200 whitespace-pre-wrap break-words leading-relaxed text-sm sm:text-base">
                                {conversationalResponse}
                            </p>
                        </div>
                    )}
                </div>

                {/* Conversational Assistant Section (Sound & Dialogue Specific) */}
                <div className="mt-8 sm:mt-10 pt-8 sm:pt-10 border-t border-gray-700">
                    <h2 className="text-2xl sm:text-3xl font-bold text-center text-yellow-400 mb-6">
                        Asisten Suara & Dialog
                    </h2>
                    <div className="mb-4">
                        <label htmlFor="sound-conversational-input" className="block text-gray-300 text-base sm:text-lg font-semibold mb-2">
                            Ketik ide suara atau dialog Anda di sini:
                        </label>
                        <textarea
                            id="sound-conversational-input"
                            value={soundConversationalInput}
                            onChange={(e) => setSoundConversationalInput(e.target.value)}
                            placeholder="Contoh: Saya butuh dialog untuk karakter yang melarikan diri."
                            rows="5"
                            className="w-full p-3 bg-gray-700/70 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:ring-3 focus:ring-yellow-500 transition duration-200 text-sm sm:text-base"
                        ></textarea>
                    </div>
                    <button
                        onClick={askSoundAssistant}
                        disabled={isSoundAssistantLoading}
                        className="w-full bg-gradient-to-r from-yellow-600 to-yellow-800 hover:from-yellow-700 hover:to-yellow-900 text-white font-bold py-3 px-4 sm:py-4 sm:px-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:from-gray-600 disabled:to-gray-800"
                    >
                        {isSoundAssistantLoading ? 'Meminta Saran...' : 'Tanyakan Asisten Suara & Dialog'}
                    </button>

                    {soundConversationalResponse && (
                        <div className="mt-8 bg-gray-700/50 p-4 sm:p-6 rounded-lg border border-gray-600 shadow-inner">
                            <h3 className="text-xl sm:text-2xl font-semibold text-yellow-300 mb-4">Respons Asisten:</h3>
                            <p className="text-gray-200 whitespace-pre-wrap break-words leading-relaxed text-sm sm:text-base">
                                {soundConversationalResponse}
                            </p>
                            <button
                                onClick={useSoundSuggestion}
                                className="mt-4 sm:mt-6 bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 text-white font-bold py-2 px-4 sm:py-3 sm:px-5 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out transform hover:scale-105 active:scale-95"
                            >
                                Gunakan Saran Ini
                            </button>
                        </div>
                    )}
                </div>
            </div>
            {/* Footer dengan copyright */}
            <footer className="mt-8 sm:mt-12 text-center text-gray-500 text-xs sm:text-sm pb-4">
                © {new Date().getFullYear()} by Lazuardy Al Farissi
            </footer>
        </div>
    );
};

// Reusable Input component for better readability
const Input = ({ id, label, value, onChange, placeholder, multiline, rows }) => {
    const commonClasses = "w-full p-3 bg-gray-700/70 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:ring-3 focus:ring-blue-500 transition duration-200 text-sm sm:text-base";
    return (
        <div className="mb-4">
            <label htmlFor={id} className="block text-gray-300 text-base sm:text-lg font-semibold mb-2">
                {label}:
            </label>
            {multiline ? (
                <textarea
                    id={id}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    rows={rows || 3} // Default 3 rows if not specified
                    className={commonClasses}
                ></textarea>
            ) : (
                <input
                    type="text"
                    id={id}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className={commonClasses}
                />
            )}
        </div>
    );
};

export default App;
