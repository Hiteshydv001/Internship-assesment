# backend/app/api/qna.py
from flask import Blueprint, request, jsonify
from app.core.agents import get_qna_chain

qna_bp = Blueprint('qna', __name__)
qna_chain = get_qna_chain()

@qna_bp.route('/api/qna', methods=['POST'])
def ask_question():
    data = request.get_json()
    if not data or 'question' not in data:
        return jsonify({"error": "Missing 'question' in request body"}), 400

    question = data['question']
    
    try:
        response = qna_chain.invoke(question)
        return jsonify({"answer": response.content})
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500