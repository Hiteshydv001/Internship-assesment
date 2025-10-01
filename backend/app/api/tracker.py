# backend/app/api/tracker.py
from flask import Blueprint, request, jsonify
from app.core.agents import get_expense_agent_executor

tracker_bp = Blueprint('tracker', __name__)
expense_agent = get_expense_agent_executor()

# Maintain a simple chat history for context
chat_history = []

@tracker_bp.route('/api/tracker', methods=['POST'])
def handle_tracker_prompt():
    data = request.get_json()
    if not data or 'prompt' not in data:
        return jsonify({"error": "Missing 'prompt' in request body"}), 400

    user_prompt = data['prompt']
    
    try:
        response = expense_agent.invoke({
            "input": user_prompt,
            "chat_history": chat_history
        })
        
        # Add interaction to history for context in subsequent calls
        chat_history.append(f"Human: {user_prompt}")
        chat_history.append(f"AI: {response['output']}")
        
        return jsonify({"response": response['output']})
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500