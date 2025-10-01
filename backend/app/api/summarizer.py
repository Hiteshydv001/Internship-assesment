# backend/app/api/summarizer.py
from flask import Blueprint, request, jsonify
from app.core.agents import get_summarizer_chain

summarizer_bp = Blueprint('summarizer', __name__)
summarizer_chain = get_summarizer_chain()

@summarizer_bp.route('/api/summarize', methods=['POST'])
def summarize_text():
    data = request.get_json()
    if not data or 'text' not in data:
        return jsonify({"error": "Missing 'text' in request body"}), 400

    text = data['text']
    
    try:
        response = summarizer_chain.invoke({"text": text})
        return jsonify({"summary": response.content})
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500