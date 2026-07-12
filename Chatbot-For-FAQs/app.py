import os
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import nltk
from nltk.tokenize import word_tokenize
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Pre-download required NLTK parsing model packages
nltk.download('punkt')

app = Flask(__name__, static_folder='.')
CORS(app)

# FAQ Database Matrix
FAQ_DATABASE = [
    {
        "question": "How do I track my order shipment status track package",
        "answer": "You can track your package live by navigating to your Profile dashboard, clicking 'My Orders', and copying the tracking ID provided."
    },
    {
        "question": "What is your refund and return policy return package item",
        "answer": "We offer a 30-day hassle-free return window. The product must be unused and in its original premium packaging."
    },
    {
        "question": "How can I update my account password or security settings change credentials login",
        "answer": "Head over to Settings -> Security. Click 'Update Password', enter your original password, verification code, and save changes."
    },
    {
        "question": "Do you offer international shipping services worldwide global tracking",
        "answer": "Yes! We ship globally across 150+ countries. Standard customs clearing metrics apply depending on your location."
    },
    {
        "question": "What secure payment methods do you accept online card checkout crypto credit paypal",
        "answer": "We accept all major credit/debit cards, PayPal, Stripe processing layers, Apple Pay, and secure cryptocurrency tokens."
    }
]

# NLTK Processing Pipeline Engine
def preprocess_text(text):
    tokens = word_tokenize(text.lower())
    clean_tokens = [word for word in tokens if word.isalnum()]
    return " ".join(clean_tokens)

@app.route('/api/chat', methods=['POST'])
def chat_endpoint():
    data = request.json or {}
    user_message = data.get('message', '').strip()
    
    if not user_message:
        return jsonify({"answer": "Please type a valid question."})
        
    clean_user_query = preprocess_text(user_message)
    clean_faq_questions = [preprocess_text(faq['question']) for faq in FAQ_DATABASE]
    
    # Vectorizer initialization for Cosine Matrix computations
    all_documents = [clean_user_query] + clean_faq_questions
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform(all_documents)
    
    # Compute Cosine Similarity metrics matrix mapping
    similarity_scores = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:]).flatten()
    best_match_idx = similarity_scores.argmax()
    highest_score = similarity_scores[best_match_idx]
    
    # Strict validation threshold logic integration
    if highest_score > 0.30:
        return jsonify({
            "answer": FAQ_DATABASE[best_match_idx]['answer'],
            "matchedQuestion": FAQ_DATABASE[best_match_idx]['question'],
            "confidence": f"{highest_score:.2f}"
        })
    else:
        return jsonify({
            "answer": "I'm sorry, I couldn't find a matching FAQ for that query. Could you please rephrase your question?",
            "confidence": f"{highest_score:.2f}"
        })

@app.route('/')
def serve_index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)

if __name__ == '__main__':
    print("🚀 NLTK & Cosine Similarity FAQ Engine online on port 8080")
    app.run(port=8080, debug=True)