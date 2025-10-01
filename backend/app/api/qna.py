# backend/app/api/qna.py
from flask import Blueprint, request, Response
from app.core.agents import get_qna_chain

qna_bp = Blueprint('qna', __name__)
qna_chain = get_qna_chain()

@qna_bp.route('/api/qna', methods=['POST'])
def ask_question():
    data = request.get_json()
    if not data or 'question' not in data:
        return Response('{"error": "Missing \'question\' in request body"}', status=400, mimetype='application/json')

    question = data['question']

    def generate():
        try:
            # Use .stream() instead of .invoke()
            for chunk in qna_chain.stream(question):
                # Yield the content of each chunk as it arrives
                if chunk.content:
                    yield chunk.content
        except Exception as e:
            # Handle potential errors during streaming
            yield f'{{"error": "An error occurred during streaming: {str(e)}"}}'

    # Return a streaming response
    return Response(generate(), mimetype='text/plain')