const expressApp = require("express");
const networkClient = require("axios");
const crossOrigin = require("cors");
const path = require("path"); // Added to resolve folder directories
require("dotenv").config();

const webServer = expressApp();

webServer.use(crossOrigin());
webServer.use(expressApp.json());

// 📦 Serve static frontend layout files (HTML, CSS, JS) from the current folder
webServer.use(expressApp.static(__dirname));

// 🌐 Root URL Route mapping to serve your application landing page
webServer.get("/", (request, response) => {
    response.sendFile(path.join(__dirname, "index.html"));
});

// Changed route mapping path to look structurally different
webServer.post("/api/v1/convert", async (request, response) => {
    try {
        const { text, srcLang, tgtLang } = request.body;

        const apiPayload = {
            q: text || "",
            source: srcLang || "en",
            target: tgtLang || "hi",
            format: "text"
        };

        const externalResponse = await networkClient.post(
            "https://libretranslate.com/translate",
            apiPayload,
            {
                headers: { "Content-Type": "application/json" }
            }
        );

        return response.json({
            output: externalResponse.data.translatedText
        });

    } catch (apiError) {
        console.error("Service exception context:", apiError.message);
        return response.status(500).json({
            status: "error",
            message: "Unable to process text conversion request."
        });
    }
});

const APP_PORT = process.env.SERVER_PORT || 8080;
webServer.listen(APP_PORT, () => {
    console.log(`Backend utility running successfully on port ${APP_PORT}`);
});