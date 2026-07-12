const chatForm = document.getElementById('chatForm');
const userInput = document.getElementById('userInput');
const chatViewport = document.getElementById('chatViewport');

chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const messageText = userInput.value.trim();
    if (!messageText) return;

    // Render User Message
    appendMessage(messageText, 'user-msg');
    userInput.value = '';
    chatViewport.scrollTop = chatViewport.scrollHeight;

    try {
        // Post message to Express text matching matrix
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: messageText })
        });

        const data = await response.json();

        // Render response with confidence value tracking metrics
        const metaDetail = data.matchedQuestion ? `Matched: "${data.matchedQuestion}" (Confidence Score: ${data.confidence})` : `Score Evaluation: ${data.confidence}`;
        appendMessage(data.answer, 'system-msg', metaDetail);
        
    } catch (error) {
        appendMessage("Transmission connection error. Backend core offline.", 'system-msg', "Error Logs");
    }

    chatViewport.scrollTop = chatViewport.scrollHeight;
});

function appendMessage(text, className, metaText = null) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${className}`;

    let innerContent = `<div class="bubble">${text}`;
    if (metaText) {
        innerContent += `<span class="meta-info">${metaText}</span>`;
    }
    innerContent += `</div>`;

    msgDiv.innerHTML = innerContent;
    chatViewport.appendChild(msgDiv);
}