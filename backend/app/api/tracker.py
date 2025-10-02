# backend/app/api/tracker.py
from flask import Blueprint, request, Response, session
from app.core.agents import get_expense_agent_executor
import time
import uuid

tracker_bp = Blueprint('tracker', __name__)

# Store conversation histories per session
conversation_histories = {}

@tracker_bp.route('/api/tracker', methods=['POST'])
def handle_tracker_prompt():
    data = request.get_json()
    if not data or 'prompt' not in data:
        return Response('{"error": "Missing \'prompt\' in request body"}', status=400, mimetype='application/json')

    user_prompt = data['prompt']
    
    # Get or create session ID
    session_id = data.get('session_id') or str(uuid.uuid4())
    
    # Get conversation history for this session
    if session_id not in conversation_histories:
        conversation_histories[session_id] = []
    
    chat_history = conversation_histories[session_id]
    
    # Execute agent synchronously first
    full_response = ""
    try:
        expense_agent = get_expense_agent_executor()
        result = expense_agent.invoke({
            "input": user_prompt, 
            "chat_history": chat_history
        })
        
        # Extract the output safely
        if isinstance(result, dict):
            full_response = result.get("output") or result.get("result") or str(result)
        else:
            full_response = str(result)
        
        if not full_response or full_response.strip() == "":
            full_response = "I couldn't process that request. Please try again."
        
        # Update chat history with the new interaction
        chat_history.append(f"Human: {user_prompt}")
        chat_history.append(f"AI: {full_response}")
        
        # Keep only last 10 messages (5 exchanges) to avoid token limit
        if len(chat_history) > 10:
            chat_history = chat_history[-10:]
        
        conversation_histories[session_id] = chat_history
                
    except StopIteration:
        full_response = "I encountered an issue processing your request. Please try again."
    except Exception as e:
        full_response = f"Error: {str(e)}"
        print(f"Exception in tracker: {e}")
    
    # Convert to list to avoid StopIteration issues
    chars = list(str(full_response))
    
    # Now create generator for streaming
    def generate():
        try:
            for char in chars:
                yield char
                time.sleep(0.01)
        except GeneratorExit:
            pass
        except StopIteration:
            pass

    return Response(generate(), 
                   mimetype='text/plain',
                   headers={
                       'Cache-Control': 'no-cache',
                       'Connection': 'keep-alive',
                       'Access-Control-Allow-Origin': '*',
                       'Access-Control-Allow-Headers': 'Content-Type',
                       'X-Session-ID': session_id
                   })