const runTranslation = document.getElementById("actionTranslateBtn");
const textDisplay = document.getElementById("outputDisplay");
const copyToClipboard = document.getElementById("actionCopyBtn");
const readAloud = document.getElementById("actionListenBtn");

async function handleTranslationProcess() {
    const userInput = document.getElementById("sourceText").value;
    const fromLang = document.getElementById("originLanguage").value;
    const toLang = document.getElementById("destinationLanguage").value;

    if (!userInput.trim()) {
        alert("Please write something to translate.");
        return;
    }

    textDisplay.innerText = "Processing translation...";

    try {
        const queryUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(userInput)}&langpair=${fromLang}|${toLang}`;
        const fetchResponse = await fetch(queryUrl);
        const parsedData = await fetchResponse.json();

        textDisplay.innerText = parsedData.responseData.translatedText;
    } catch (err) {
        console.error("Error standard message:", err);
        textDisplay.innerText = "Error: Couldn't complete translation.";
    }
}

runTranslation.addEventListener("click", handleTranslationProcess);

copyToClipboard.addEventListener("click", () => {
    const stringData = textDisplay.innerText;

    if (!stringData || stringData === "Processing translation...") {
        alert("No text available to copy.");
        return;
    }

    navigator.clipboard.writeText(stringData);
    alert("Saved to clipboard!");
});

readAloud.addEventListener("click", () => {
    const speechString = textDisplay.innerText;

    if (!speechString || speechString === "Processing translation...") {
        alert("No output available for audio playback.");
        return;
    }

    const narration = new SpeechSynthesisUtterance(speechString);
    const chosenLang = document.getElementById("destinationLanguage").value;

    switch (chosenLang) {
        case "hi": narration.lang = "hi-IN"; break;
        case "fr": narration.lang = "fr-FR"; break;
        case "es": narration.lang = "es-ES"; break;
        case "de": narration.lang = "de-DE"; break;
        default: narration.lang = "en-US";
    }

    window.speechSynthesis.speak(narration);
});