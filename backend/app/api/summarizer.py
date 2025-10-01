# backend/app/api/summarizer.py
from flask import Blueprint, request, Response
from app.core.agents import get_summarizer_chain

summarizer_bp = Blueprint('summarizer', __name__)
summarizer_chain = get_summarizer_chain()

@summarizer_bp.route('/api/summarize', methods=['POST'])
def summarize_text():
    data = request.get_json()
    if not data or 'text' not in data:
        return Response('{"error": "Missing \'text\' in request body"}', status=400, mimetype='application/json')

    text = data['text']

    def generate():
        try:
            # Use .stream() instead of .invoke()
            for chunk in summarizer_chain.stream({"text": text}):
                if chunk.content:
                    yield chunk.content
        except Exception as e:
            yield f'{{"error": "An error occurred during streaming: {str(e)}"}}'
    
    return Response(generate(), mimetype='text/plain')