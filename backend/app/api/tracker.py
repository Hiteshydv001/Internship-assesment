# backend/app/api/tracker.py
from flask import Blueprint, request, Response
from app.core.agents import get_expense_agent_executor

tracker_bp = Blueprint('tracker', __name__)

# NOTE: Agent state is tricky. For simplicity, we create a new agent per request.
# For production, you'd manage conversation history in a database.
# chat_history = [] # This simple in-memory history won't work well with streaming agents.

@tracker_bp.route('/api/tracker', methods=['POST'])
def handle_tracker_prompt():
    data = request.get_json()
    if not data or 'prompt' not in data:
        return Response('{"error": "Missing \'prompt\' in request body"}', status=400, mimetype='application/json')

    user_prompt = data['prompt']
    
    def generate():
        try:
            # Create a fresh agent for the request to handle state properly
            expense_agent = get_expense_agent_executor()
            
            # The agent's stream provides dicts. We need the 'output' or 'steps'.
            for chunk in expense_agent.stream({"input": user_prompt, "chat_history": []}):
                # Check for the final answer chunk
                if "output" in chunk:
                    yield chunk["output"]
                    
        except Exception as e:
            yield f'{{"error": "An error occurred during streaming: {str(e)}"}}'

    return Response(generate(), mimetype='text/plain')